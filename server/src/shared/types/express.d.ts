import "express";
import { TokenPayload } from "../../domain/services/ITokenService";

declare module "express-serve-static-core" {
  interface Request {
    requestId: string;
    user?: TokenPayload;
  }
}
