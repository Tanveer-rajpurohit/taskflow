"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Loader2,
  XCircle,
  RefreshCw,
  Terminal,
  FileOutput,
  Info,
} from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";

type TaskStatus = "pending" | "running" | "completed" | "failed";
type OperationType = "Uppercase" | "Lowercase" | "Reverse" | "Word Count";

type TaskDetail = {
  id: string;
  title: string;
  operation: OperationType;
  createdAt: string;
  inputText: string;
  result: string;
  allLogs: string[];
};

const TASK_DATA: Record<string, TaskDetail> = {
  "1": {
    id: "1",
    title: "Process customer feedback",
    operation: "Uppercase",
    createdAt: "Today at 10:32 AM",
    inputText:
      "This is the customer feedback text that needs to be processed. The product quality is excellent and the support team was very helpful.",
    result:
      "THIS IS THE CUSTOMER FEEDBACK TEXT THAT NEEDS TO BE PROCESSED. THE PRODUCT QUALITY IS EXCELLENT AND THE SUPPORT TEAM WAS VERY HELPFUL.",
    allLogs: [
      "[10:32:01] Task received — id: 1",
      "[10:32:01] Validating input payload...",
      "[10:32:02] Worker picked up — worker-3",
      "[10:32:02] Processing: UPPERCASE transformation",
      "[10:32:02] Output written successfully",
      "[10:32:02] Task completed — duration: 1.2s",
    ],
  },
  "2": {
    id: "2",
    title: "Normalize API response data",
    operation: "Lowercase",
    createdAt: "Today at 11:14 AM",
    inputText:
      "HTTP/1.1 200 OK Content-Type: APPLICATION/JSON Authorization: BEARER TOKEN XYZ123 Cache-Control: NO-CACHE, NO-STORE Pragma: NO-CACHE",
    result:
      "http/1.1 200 ok content-type: application/json authorization: bearer token xyz123 cache-control: no-cache, no-store pragma: no-cache",
    allLogs: [
      "[11:14:01] Task received — id: 2",
      "[11:14:01] Validating input payload...",
      "[11:14:02] Worker picked up — worker-1",
      "[11:14:02] Processing: LOWERCASE transformation",
      "[11:14:03] Output written successfully",
      "[11:14:03] Task completed — duration: 2.4s",
    ],
  },
  "3": {
    id: "3",
    title: "Analyze word frequency in docs",
    operation: "Word Count",
    createdAt: "Today at 11:52 AM",
    inputText:
      "The quick brown fox jumps over the lazy dog. The dog barked loudly and the fox ran away quickly.",
    result: "Total words: 18",
    allLogs: [
      "[11:52:00] Task received — id: 3",
      "[11:52:00] Validating input payload...",
    ],
  },
  "4": {
    id: "4",
    title: "Reverse encoded string tokens",
    operation: "Reverse",
    createdAt: "Today at 06:18 AM",
    inputText: "SGVsbG8gV29ybGQgZnJvbSBUYXNrZmxvdyE=",
    result: "",
    allLogs: [
      "[06:18:01] Task received — id: 4",
      "[06:18:01] Validating input payload...",
      "[06:18:02] Worker picked up — worker-2",
      "[06:18:02] Processing: REVERSE transformation",
      "[06:18:02] ERROR: Input contains non-UTF-8 sequences",
      "[06:18:02] Task failed — reason: encoding error",
    ],
  },
  "5": {
    id: "5",
    title: "Uppercase product name batch",
    operation: "Uppercase",
    createdAt: "Today at 08:45 AM",
    inputText: "taskflow pro, taskflow enterprise, taskflow lite, taskflow api",
    result: "TASKFLOW PRO, TASKFLOW ENTERPRISE, TASKFLOW LITE, TASKFLOW API",
    allLogs: [
      "[08:45:01] Task received — id: 5",
      "[08:45:01] Validating input payload...",
      "[08:45:02] Worker picked up — worker-4",
      "[08:45:02] Processing: UPPERCASE transformation",
      "[08:45:02] Output written successfully",
      "[08:45:02] Task completed — duration: 0.8s",
    ],
  },
  "6": {
    id: "6",
    title: "Process daily log entries",
    operation: "Word Count",
    createdAt: "Today at 07:02 AM",
    inputText:
      "Server started on port 3000. Database connected. API routes registered. Cache warmed. Background workers initialized. System ready.",
    result: "Total words: 20",
    allLogs: [
      "[07:02:01] Task received — id: 6",
      "[07:02:01] Validating input payload...",
      "[07:02:02] Worker picked up — worker-1",
      "[07:02:02] Processing: WORD COUNT operation",
      "[07:02:02] Output written successfully",
      "[07:02:02] Task completed — duration: 0.6s",
    ],
  },
};

const FALLBACK_TASK: TaskDetail = TASK_DATA["1"];

type StatusPhase = {
  status: TaskStatus;
  logCount: number;
};

const RUNNING_PHASES: StatusPhase[] = [
  { status: "running", logCount: 1 },
  { status: "running", logCount: 2 },
  { status: "running", logCount: 3 },
  { status: "running", logCount: 4 },
  { status: "completed", logCount: 6 },
];

type StatusMeta = {
  cls: string;
  label: string;
  icon: React.ElementType;
  dotColor: string;
};

const STATUS_META: Record<TaskStatus, StatusMeta> = {
  pending: {
    cls: "badge badge-pending",
    label: "Pending",
    icon: Clock,
    dotColor: "#E65100",
  },
  running: {
    cls: "badge badge-running",
    label: "Running",
    icon: Loader2,
    dotColor: "#1565C0",
  },
  completed: {
    cls: "badge badge-success",
    label: "Completed",
    icon: CheckCircle2,
    dotColor: "#2E7D32",
  },
  failed: {
    cls: "badge badge-failed",
    label: "Failed",
    icon: XCircle,
    dotColor: "#C62828",
  },
};

const getInitialStatus = (task: TaskDetail): TaskStatus => {
  if (task.id === "2") return "running";
  if (task.id === "3") return "pending";
  if (task.id === "4") return "failed";
  return "completed";
};

const getInitialPhase = (task: TaskDetail): number => {
  if (task.id === "2") return 0;
  return 0;
};

export default function TaskDetailPage(): React.JSX.Element {
  const params = useParams<{ id: string }>();
  const taskId = params?.id ?? "1";
  const task = TASK_DATA[taskId] ?? FALLBACK_TASK;

  const [phase, setPhase] = useState<number>(() => getInitialPhase(task));
  const [currentStatus, setCurrentStatus] = useState<TaskStatus>(() =>
    getInitialStatus(task)
  );
  const [lastRefreshed, setLastRefreshed] = useState<string>("just now");

  const isRunning = currentStatus === "running";
  const isSimulated = task.id === "2";

  const advancePhase = useCallback((): void => {
    setPhase((prev) => {
      const next = prev + 1;
      if (next >= RUNNING_PHASES.length) return RUNNING_PHASES.length - 1;
      const newPhase = RUNNING_PHASES[next];
      setCurrentStatus(newPhase.status);
      setLastRefreshed("just now");
      return next;
    });
  }, []);

  useEffect(() => {
    if (!isSimulated || currentStatus !== "running") return;
    const interval = setInterval(advancePhase, 2000);
    return () => clearInterval(interval);
  }, [isSimulated, currentStatus, advancePhase]);

  const visibleLogCount = isSimulated
    ? RUNNING_PHASES[phase]?.logCount ?? task.allLogs.length
    : task.allLogs.length;

  const visibleLogs = task.allLogs.slice(0, visibleLogCount);
  const showResult = currentStatus === "completed";
  const showResultEmpty = currentStatus === "pending" || currentStatus === "running";

  const meta = STATUS_META[currentStatus];
  const StatusIcon = meta.icon;

  return (
    <DashboardShell>
      {/* ── TOP BAR ───────────────────────────────────────────── */}
      <header
        style={{
          background: "#fff",
          borderBottom: "1px solid var(--warm-100)",
          padding: "0 32px",
          height: 64,
          display: "flex",
          alignItems: "center",
          gap: 16,
          flexShrink: 0,
        }}
      >
        <Link
          href="/dashboard"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 34,
            height: 34,
            borderRadius: 9,
            border: "1.5px solid var(--warm-100)",
            color: "var(--warm-600)",
            textDecoration: "none",
            transition: "background 0.15s",
            flexShrink: 0,
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.background = "var(--surface)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.background = "transparent")
          }
        >
          <ArrowLeft size={15} />
        </Link>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 18,
                fontWeight: 400,
                color: "var(--warm-800)",
                lineHeight: 1,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {task.title}
            </h1>
            <span className={meta.cls} style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 5 }}>
              <StatusIcon
                size={10}
                strokeWidth={2.5}
                style={currentStatus === "running" ? { animation: "spin 1s linear infinite" } : undefined}
              />
              {meta.label}
            </span>
          </div>
          <p style={{ fontSize: 12, color: "var(--warm-400)", marginTop: 3 }}>
            Created {task.createdAt}
            {isSimulated && (
              <span style={{ marginLeft: 8, color: "var(--warm-400)" }}>
                · Auto-refreshing every 2s
              </span>
            )}
          </p>
        </div>

        {isRunning && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              color: "var(--warm-400)",
              flexShrink: 0,
            }}
          >
            <RefreshCw size={12} style={{ animation: "spin 2s linear infinite" }} />
            Refreshed {lastRefreshed}
          </div>
        )}
      </header>

      {/* ── CONTENT: two-column layout ────────────────────────── */}
      <main
        style={{
          flex: 1,
          padding: "28px 32px",
          display: "grid",
          gridTemplateColumns: "1fr 1.5fr",
          gap: 20,
          alignItems: "start",
        }}
      >
        {/* ── LEFT COLUMN: Task metadata ─────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Task info card */}
          <div
            style={{
              background: "#fff",
              border: "1px solid var(--warm-100)",
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid var(--warm-100)",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Info size={13} color="var(--warm-400)" />
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--warm-600)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Task Info
              </span>
            </div>

            <div
              style={{
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              {/* Operation */}
              <div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "var(--warm-400)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: 6,
                  }}
                >
                  Operation
                </div>
                <span
                  style={{
                    display: "inline-flex",
                    padding: "4px 12px",
                    borderRadius: 99,
                    fontSize: 12,
                    fontWeight: 700,
                    background: "var(--warm-800)",
                    color: "#fff",
                    letterSpacing: "0.04em",
                  }}
                >
                  {task.operation.toUpperCase()}
                </span>
              </div>

              {/* Status */}
              <div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "var(--warm-400)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: 6,
                  }}
                >
                  Status
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span
                    style={{
                      width: 9,
                      height: 9,
                      borderRadius: "50%",
                      background: meta.dotColor,
                      flexShrink: 0,
                      boxShadow: isRunning
                        ? `0 0 0 3px ${meta.dotColor}22`
                        : "none",
                    }}
                  />
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "var(--warm-800)",
                    }}
                  >
                    {meta.label}
                  </span>
                </div>
              </div>

              {/* Created at */}
              <div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "var(--warm-400)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: 6,
                  }}
                >
                  Created At
                </div>
                <span
                  style={{
                    fontSize: 13,
                    color: "var(--warm-600)",
                    fontWeight: 500,
                  }}
                >
                  {task.createdAt}
                </span>
              </div>

              {/* Task ID */}
              <div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "var(--warm-400)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: 6,
                  }}
                >
                  Task ID
                </div>
                <code
                  style={{
                    fontSize: 12,
                    color: "var(--warm-600)",
                    background: "var(--surface)",
                    padding: "3px 8px",
                    borderRadius: 6,
                    fontFamily: "monospace",
                  }}
                >
                  task-{task.id.padStart(6, "0")}
                </code>
              </div>
            </div>
          </div>

          {/* Input text card */}
          <div
            style={{
              background: "#fff",
              border: "1px solid var(--warm-100)",
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "14px 20px",
                borderBottom: "1px solid var(--warm-100)",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <FileOutput size={13} color="var(--warm-400)" />
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--warm-600)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Input Text
              </span>
            </div>
            <div
              style={{
                padding: "16px 20px",
                fontSize: 13,
                color: "var(--warm-600)",
                lineHeight: 1.7,
                fontFamily: "monospace",
                whiteSpace: "pre-wrap",
                wordBreak: "break-all",
                maxHeight: 200,
                overflowY: "auto",
              }}
            >
              {task.inputText}
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN: Result + Logs ────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Result box */}
          <div
            style={{
              background: "#fff",
              border: "1px solid var(--warm-100)",
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "14px 20px",
                borderBottom: "1px solid var(--warm-100)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Terminal size={13} color="var(--warm-400)" />
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "var(--warm-600)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  Result
                </span>
              </div>
              {showResult && (
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#2E7D32",
                    background: "#E8F5E9",
                    padding: "3px 10px",
                    borderRadius: 99,
                  }}
                >
                  Ready
                </span>
              )}
            </div>

            <div
              style={{
                padding: "20px",
                minHeight: 120,
                display: "flex",
                alignItems: showResult ? "flex-start" : "center",
                justifyContent: showResult ? "flex-start" : "center",
              }}
            >
              {showResult ? (
                <pre
                  style={{
                    margin: 0,
                    fontSize: 13,
                    lineHeight: 1.7,
                    color: "var(--warm-800)",
                    fontFamily: "monospace",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-all",
                    background: "var(--surface)",
                    padding: "14px 16px",
                    borderRadius: 10,
                    width: "100%",
                    boxSizing: "border-box",
                    border: "1px solid var(--warm-100)",
                  }}
                >
                  {task.result}
                </pre>
              ) : currentStatus === "failed" ? (
                <div
                  style={{
                    textAlign: "center",
                    color: "#C62828",
                  }}
                >
                  <XCircle size={28} strokeWidth={1.5} style={{ marginBottom: 8, opacity: 0.6 }} />
                  <p style={{ fontSize: 13, fontWeight: 500 }}>
                    Task failed — no output available
                  </p>
                </div>
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    color: "var(--warm-400)",
                  }}
                >
                  <Loader2
                    size={24}
                    strokeWidth={1.5}
                    style={{
                      marginBottom: 8,
                      opacity: 0.5,
                      animation: showResultEmpty ? "spin 1.5s linear infinite" : "none",
                    }}
                  />
                  <p style={{ fontSize: 13 }}>
                    {currentStatus === "pending"
                      ? "Waiting to be picked up..."
                      : "Processing your task..."}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Logs box */}
          <div
            style={{
              background: "#1a1614",
              border: "1px solid #2e2825",
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "14px 20px",
                borderBottom: "1px solid #2e2825",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Terminal size={13} color="#7a6e6a" />
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#7a6e6a",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  Processing Logs
                </span>
              </div>
              <span style={{ fontSize: 11, color: "#5a504c" }}>
                {visibleLogs.length} / {task.allLogs.length} lines
              </span>
            </div>

            <div
              style={{
                padding: "16px 20px",
                minHeight: 160,
                fontFamily: "monospace",
                fontSize: 12,
                lineHeight: 1.9,
                overflowY: "auto",
                maxHeight: 280,
              }}
            >
              {visibleLogs.length === 0 ? (
                <span style={{ color: "#4a4240" }}>
                  Waiting for worker to pick up task...
                </span>
              ) : (
                visibleLogs.map((line, i) => (
                  <div
                    key={i}
                    style={{
                      color: line.includes("ERROR") || line.includes("failed")
                        ? "#ef9a9a"
                        : line.includes("completed") || line.includes("successfully")
                        ? "#a5d6a7"
                        : line.includes("Processing")
                        ? "#90caf9"
                        : "#a8967e",
                    }}
                  >
                    {line}
                  </div>
                ))
              )}
              {isRunning && (
                <div
                  style={{
                    color: "#5a504c",
                    marginTop: 4,
                  }}
                >
                  <span style={{ animation: "pulse 1s ease-in-out infinite" }}>
                    ▋
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

    </DashboardShell>
  );
}
