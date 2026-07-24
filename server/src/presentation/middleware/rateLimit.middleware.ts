import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { Request } from "express";
import { TooManyRequestsError } from "../../shared/errors";

export interface RateLimiterConfig {
  windowMs: number;
  max: number;
  keyGenerator?: (req: Request) => string;
}

export const createRateLimiter = (
  config: RateLimiterConfig,
): ReturnType<typeof rateLimit> => {
  return rateLimit({
    windowMs: config.windowMs,
    max: config.max,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator:
      config.keyGenerator ?? ((req) => ipKeyGenerator(req.ip ?? "")),
    handler: (_req, _res, next) => {
      next(
        new TooManyRequestsError("Too many requests. Please try again later."),
      );
    },
  });
};
