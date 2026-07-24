import { Redis as RedisInstance } from "ioredis";
import { ICacheService } from "../../domain/services/ICacheService";
import { redisClient } from "./redis.client";
import { logger } from "../logger/logger";

export class RedisCacheService implements ICacheService {
  private get client(): RedisInstance {
    return redisClient.getClient();
  }

  public async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.client.get(key);
      if (!value) {
        return null;
      }
      return JSON.parse(value) as T;
    } catch (error) {
      logger.error(
        `RedisCacheService.get error for key "${key}": ${(error as Error).message}`,
      );
      return null;
    }
  }

  public async set<T>(
    key: string,
    value: T,
    ttlSeconds?: number,
  ): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      if (ttlSeconds && ttlSeconds > 0) {
        await this.client.set(key, serialized, "EX", ttlSeconds);
      } else {
        await this.client.set(key, serialized);
      }
    } catch (error) {
      logger.error(
        `RedisCacheService.set error for key "${key}": ${(error as Error).message}`,
      );
    }
  }

  public async del(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (error) {
      logger.error(
        `RedisCacheService.del error for key "${key}": ${(error as Error).message}`,
      );
    }
  }

  public async delByPattern(pattern: string): Promise<void> {
    try {
      const stream = this.client.scanStream({ match: pattern, count: 100 });
      const pipeline = this.client.pipeline();
      let hasKeys = false;

      await new Promise<void>((resolve, reject) => {
        stream.on("data", (keys: string[]) => {
          if (keys.length) {
            hasKeys = true;
            keys.forEach((key) => pipeline.del(key));
          }
        });
        stream.on("end", () => resolve());
        stream.on("error", (err: Error) => reject(err));
      });

      if (hasKeys) {
        await pipeline.exec();
      }
    } catch (error) {
      logger.error(
        `RedisCacheService.delByPattern error for pattern "${pattern}": ${(error as Error).message}`,
      );
    }
  }

  public async exists(key: string): Promise<boolean> {
    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      logger.error(
        `RedisCacheService.exists error for key "${key}": ${(error as Error).message}`,
      );
      return false;
    }
  }

  public async expire(key: string, ttlSeconds: number): Promise<void> {
    try {
      await this.client.expire(key, ttlSeconds);
    } catch (error) {
      logger.error(
        `RedisCacheService.expire error for key "${key}": ${(error as Error).message}`,
      );
    }
  }

  public async increment(key: string, by = 1): Promise<number> {
    try {
      return await this.client.incrby(key, by);
    } catch (error) {
      logger.error(
        `RedisCacheService.increment error for key "${key}": ${(error as Error).message}`,
      );
      return 0;
    }
  }

  public async flushAll(): Promise<void> {
    try {
      await this.client.flushdb();
      logger.warn("Redis cache flushed");
    } catch (error) {
      logger.error(
        `RedisCacheService.flushAll error: ${(error as Error).message}`,
      );
    }
  }
}
