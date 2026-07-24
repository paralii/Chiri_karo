import express, { Application, Router } from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import hpp from "hpp";
import { appConfig } from "./infrastructure/config";
import {
  requestIdMiddleware,
  notFoundMiddleware,
  errorMiddleware,
  sanitizeInput,
} from "./presentation/middleware";
import { globalApiRateLimiter } from "./presentation/middleware/rateLimiters";
import { requestLogger } from "./infrastructure/logger/requestLogger";

export class App {
  public readonly instance: Application;

  constructor() {
    this.instance = express();
    this.initializeGlobalMiddlewares();
    this.initializeHealthCheck();
  }

  private initializeGlobalMiddlewares(): void {
    this.instance.use(requestIdMiddleware);
    this.instance.use(requestLogger);

    this.instance.use(
      helmet({
        crossOriginResourcePolicy: { policy: "cross-origin" },
      }),
    );

    this.instance.use(
      cors({
        origin: appConfig.clientUrl,
        credentials: true,
      }),
    );

    this.instance.use(compression());
    this.instance.use(express.json({ limit: "10mb" }));
    this.instance.use(express.urlencoded({ extended: true, limit: "10mb" }));
    this.instance.use(cookieParser());

    // checkQuery disabled: hpp reassigns req.query, which is unreliable on
    // Express 5 (see sanitizeInput's doc comment for the same caveat).
    this.instance.use(hpp({ checkQuery: false }));
    this.instance.use(sanitizeInput);
    this.instance.use(globalApiRateLimiter);
  }

  private initializeHealthCheck(): void {
    this.instance.get("/health", (_req, res) => {
      res.status(200).json({
        success: true,
        message: `${appConfig.nodeName} is running`,
        environment: appConfig.nodeEnv,
        timestamp: new Date().toISOString(),
      });
    });
  }

  public registerRoutes(router: Router): void {
    this.instance.use(appConfig.apiPrefix, router);
  }

  public registerErrorHandlers(): void {
    this.instance.use(notFoundMiddleware);
    this.instance.use(errorMiddleware);
  }
}

export const app = new App();
