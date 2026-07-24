import { env } from "@infrastructure/config/env";

export interface LoggerConfig {
  level: string;
  isProduction: boolean;
}

export const loggerConfig: LoggerConfig = {
  level: env.LOG_LEVEL,
  isProduction: env.NODE_ENV === "production",
};
