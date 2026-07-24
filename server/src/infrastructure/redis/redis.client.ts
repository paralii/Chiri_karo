import Redis, { Redis as RedisInstance } from "ioredis";
import { redisConfig } from "../config";
import { logger } from "../logger/logger";

class RedisClient {
  private client: RedisInstance | null = null;

  public async connect(): Promise<RedisInstance> {
    if (this.client) {
      return this.client;
    }

    this.client = new Redis(redisConfig.url, {
      maxRetriesPerRequest: 3,
      retryStrategy: (times: number) => Math.min(times * 100, 3000),
    });

    this.client.on("connect", () => {
      logger.info("Redis client connected");
    });

    this.client.on("ready", () => {
      logger.info("Redis client ready");
    });

    this.client.on("error", (err: Error) => {
      logger.error(`Redis client error: ${err.message}`);
    });

    this.client.on("close", () => {
      logger.warn("Redis client connection closed");
    });

    this.client.on("reconnecting", () => {
      logger.info("Redis client reconnecting");
    });

    await this.client.ping();

    return this.client;
  }

  public getClient(): RedisInstance {
    if (!this.client) {
      throw new Error("Redis client not initialized. Call connect() first.");
    }
    return this.client;
  }

  public async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.quit();
      this.client = null;
      logger.info("Redis client disconnected");
    }
  }

  public isConnected(): boolean {
    return this.client !== null && this.client.status === "ready";
  }
}

export const redisClient = new RedisClient();
