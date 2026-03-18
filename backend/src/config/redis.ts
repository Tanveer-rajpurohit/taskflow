import Redis from "ioredis";

const QUEUE_KEY = "taskflow:queue";

const createRedisClient = (): Redis => {
    const client = new Redis({
        host: process.env.REDIS_HOST || "localhost",
        port: Number(process.env.REDIS_PORT) || 6379,
        maxRetriesPerRequest: 3,
        retryStrategy: (times) => {
            if (times > 5) {
                console.error("Redis retry limit reached");
                return null;
            }
            return Math.min(times * 200, 2000);
        },
        lazyConnect: false,
    });

    client.on("connect", () => console.log("Redis connected"));
    client.on("error", (err) => console.error("Redis error:", err.message));
    client.on("close", () => console.warn("Redis connection closed"));

    return client;

}

export const redis = createRedisClient();