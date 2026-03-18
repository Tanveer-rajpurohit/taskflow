"""
Taskflow Python Worker
Listens on the Redis queue `taskflow:queue` using BLPOP and processes
text jobs written by the Node.js backend.

Job payload (JSON):
  {
    "taskId":    "<MongoDB ObjectId string>",
    "userId":    "<MongoDB ObjectId string>",
    "operation": "uppercase" | "lowercase" | "reverse" | "word_count",
    "inputText": "<string>"
  }

Task lifecycle managed here:
  pending  →  running  →  success | failed
"""

import json
import logging
import os
import signal
import sys
import time
from datetime import datetime, timezone

import redis
from dotenv import load_dotenv
from pymongo import MongoClient
from pymongo.collection import Collection
from pymongo.errors import PyMongoError

 
load_dotenv()

# Logging setup 
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
log = logging.getLogger("taskflow-worker")

# Constants 
QUEUE_KEY       = "taskflow:queue"   # Must match backend/src/config/redis.ts
BLPOP_TIMEOUT   = 5                  # seconds to wait per BLPOP call
WORKER_PID      = os.getpid()
MAX_RETRIES     = 3                  # MongoDB op retries on transient errors

#  Environment 
MONGO_URI   = os.getenv("MONGO_URI",   "mongodb://127.0.0.1:27017/taskflow")
REDIS_HOST  = os.getenv("REDIS_HOST",  "127.0.0.1")
REDIS_PORT  = int(os.getenv("REDIS_PORT", "6379"))
DB_NAME     = os.getenv("MONGO_DB_NAME", "taskflow")  # extracted from URI if not set



# Helpers


def now_utc() -> str:
    """Return current UTC time as ISO-8601 string (matches JS Date.toISOString())."""
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def make_log(message: str, level: str = "info") -> dict:
    """Build a log entry that matches the ITaskLog schema."""
    return {"timestamp": now_utc(), "message": message, "level": level}


def extract_db_name(mongo_uri: str, fallback: str = "taskflow") -> str:
    """Extract database name from a MongoDB URI string."""
    try:
       
        without_query = mongo_uri.split("?")[0]
        parts = [p for p in without_query.split("/") if p]
       
        slash_count = without_query.count("/")
        if slash_count >= 3:
            candidate = without_query.split("/", 3)[-1].split("?")[0]
            return candidate if candidate else fallback
        return fallback
    except Exception:
        return fallback



# Task processor


def process_operation(operation: str, input_text: str) -> tuple[str | None, str | None]:
    """
    Run the requested text operation.

    Returns:
        (result_string, error_message)  — one of them is None.
    """
    try:
        op = operation.strip().lower()

        if op == "uppercase":
            return input_text.upper(), None

        elif op == "lowercase":
            return input_text.lower(), None

        elif op == "reverse":
            return input_text[::-1], None

        elif op == "word_count":
            words = input_text.split()
            count = len(words)
            return str(count), None

        else:
            return None, f"Unknown operation: '{operation}'"

    except Exception as exc:
        return None, f"Operation error: {exc}"



# MongoDB update helpers


def mark_running(collection: Collection, task_id: str, start_ts: str) -> None:
    """Set task status to 'running' and record start time + worker PID."""
    collection.update_one(
        {"_id": __bson_id(task_id)},
        {
            "$set": {
                "status":    "running",
                "startedAt": start_ts,
                "workerPid": WORKER_PID,
            },
            "$push": {
                "logs": make_log(f"Worker picked up task — PID: {WORKER_PID}", "info"),
            },
        },
    )


def mark_success(
    collection: Collection,
    task_id: str,
    result: str,
    duration_ms: int,
    end_ts: str,
    extra_logs: list[dict],
) -> None:
    """Set task status to 'success' with result and timing info."""
    logs_to_push = extra_logs + [
        make_log(f"✓ Task completed successfully — {duration_ms}ms", "success"),
    ]
    collection.update_one(
        {"_id": __bson_id(task_id)},
        {
            "$set": {
                "status":      "success",
                "result":      result,
                "completedAt": end_ts,
                "durationMs":  duration_ms,
                "errorMessage": None,
            },
            "$push": {"logs": {"$each": logs_to_push}},
        },
    )


def mark_failed(
    collection: Collection,
    task_id: str,
    error_message: str,
    duration_ms: int,
    end_ts: str,
    extra_logs: list[dict],
) -> None:
    """Set task status to 'failed' with error details."""
    logs_to_push = extra_logs + [
        make_log(f"✗ Task failed — {error_message}", "error"),
    ]
    collection.update_one(
        {"_id": __bson_id(task_id)},
        {
            "$set": {
                "status":       "failed",
                "completedAt":  end_ts,
                "durationMs":   duration_ms,
                "errorMessage": error_message,
            },
            "$inc": {"retryCount": 1},
            "$push": {"logs": {"$each": logs_to_push}},
        },
    )


def __bson_id(task_id: str):
    """Convert string to BSON ObjectId."""
    from bson import ObjectId
    return ObjectId(task_id)



# Core job handler


def handle_job(collection: Collection, payload: dict) -> None:
    """Process a single job from the queue end-to-end."""
    task_id   = payload.get("taskId")
    operation = payload.get("operation", "")
    input_text = payload.get("inputText", "")
    user_id   = payload.get("userId", "unknown")

    if not task_id:
        log.error("Received job with missing taskId — skipping")
        return

    log.info(f"Processing task {task_id} | op={operation} | user={user_id}")

    start_ts  = now_utc()
    start_ns  = time.monotonic_ns()

    #  1. Mark as running 
    try:
        mark_running(collection, task_id, start_ts)
    except Exception as exc:
        log.error(f"Failed to mark task {task_id} as running: {exc}")
        return  

    # 2. Build intermediate logs 
    intermediate_logs: list[dict] = [
        make_log(f"Validating input — length: {len(input_text)} chars", "info"),
        make_log(f"Executing operation: {operation}", "info"),
    ]

    #  3. Execute the operation 
    result, error = process_operation(operation, input_text)

    end_ns      = time.monotonic_ns()
    end_ts      = now_utc()
    duration_ms = (end_ns - start_ns) // 1_000_000 

    #  4. Persist result 
    try:
        if result is not None:
            mark_success(collection, task_id, result, duration_ms, end_ts, intermediate_logs)
            log.info(f"Task {task_id} SUCCESS — {duration_ms}ms")
        else:
            mark_failed(collection, task_id, error or "Unknown error", duration_ms, end_ts, intermediate_logs)
            log.warning(f"Task {task_id} FAILED — {error}")
    except Exception as exc:
        log.error(f"Failed to persist result for task {task_id}: {exc}")
        try:
            mark_failed(
                collection,
                task_id,
                f"DB write error: {exc}",
                duration_ms,
                end_ts,
                [],
            )
        except Exception:
            pass  



# Connections


def create_redis_client() -> redis.Redis:
    """Create and verify a Redis connection."""
    client = redis.Redis(
        host=REDIS_HOST,
        port=REDIS_PORT,
        decode_responses=True,
        socket_connect_timeout=5,
        socket_timeout=BLPOP_TIMEOUT + 2,
        retry_on_timeout=True,
    )
    client.ping()  # raises ConnectionError if unreachable
    return client


def create_mongo_client() -> tuple[MongoClient, Collection]:
    """Create MongoDB client and return (client, tasks_collection)."""
    db_name = DB_NAME if DB_NAME != "taskflow" else extract_db_name(MONGO_URI, "taskflow")
    mongo   = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    mongo.admin.command("ping")  # raises if unreachable
    db         = mongo[db_name]
    collection = db["tasks"]
    return mongo, collection



# Graceful shutdown


_shutdown = False


def _handle_signal(signum, _frame):
    global _shutdown
    log.info(f"Received signal {signum} — shutting down gracefully…")
    _shutdown = True


signal.signal(signal.SIGINT,  _handle_signal)
signal.signal(signal.SIGTERM, _handle_signal)



# Main loop


def main() -> None:
    log.info("=" * 60)
    log.info(f"Taskflow Python Worker  (PID {WORKER_PID})")
    log.info(f"Redis   : {REDIS_HOST}:{REDIS_PORT}")
    log.info(f"MongoDB : {MONGO_URI}")
    log.info(f"Queue   : {QUEUE_KEY}")
    log.info("=" * 60)

    #  Connect 
    try:
        redis_client = create_redis_client()
        log.info("✓ Redis connected")
    except Exception as exc:
        log.critical(f"Cannot connect to Redis: {exc}")
        sys.exit(1)

    try:
        mongo_client, task_collection = create_mongo_client()
        log.info("✓ MongoDB connected")
    except Exception as exc:
        log.critical(f"Cannot connect to MongoDB: {exc}")
        sys.exit(1)

    log.info(f"Listening on queue '{QUEUE_KEY}' …\n")

    #  Event loop 
    while not _shutdown:
        try:
            # BLPOP blocks for BLPOP_TIMEOUT seconds then returns None
            # Format: (queue_name, json_payload)  or  None on timeout
            response = redis_client.blpop(QUEUE_KEY, timeout=BLPOP_TIMEOUT)

            if response is None:
                # Timeout — just loop again (allows shutdown check)
                continue

            _, raw_payload = response

            try:
                payload = json.loads(raw_payload)
            except json.JSONDecodeError as exc:
                log.error(f"Invalid JSON in queue: {exc} — raw: {raw_payload!r}")
                continue

            handle_job(task_collection, payload)

        except redis.exceptions.ConnectionError as exc:
            if _shutdown:
                break
            log.error(f"Redis connection lost: {exc} — retrying in 3s…")
            time.sleep(3)
            try:
                redis_client = create_redis_client()
                log.info("Redis reconnected")
            except Exception:
                pass  # Will retry on next iteration

        except redis.exceptions.ResponseError as exc:
            log.error(f"Redis response error: {exc}")
            time.sleep(1)

        except PyMongoError as exc:
            log.error(f"MongoDB error: {exc}")
            time.sleep(1)

        except KeyboardInterrupt:
            break

        except Exception as exc:
            log.exception(f"Unexpected error in main loop: {exc}")
            time.sleep(1)

    #  Cleanup 
    log.info("Closing connections…")
    try:
        redis_client.close()
    except Exception:
        pass
    try:
        mongo_client.close()
    except Exception:
        pass
    log.info("Worker stopped cleanly. Bye!")


if __name__ == "__main__":
    main()