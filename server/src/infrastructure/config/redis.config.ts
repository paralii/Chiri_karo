import { env } from "@infrastructure/config/env";

export interface RedisConfig {
  url: string;
}

export const redisConfig: RedisConfig = {
  url: env.REDIS_URL,
};
