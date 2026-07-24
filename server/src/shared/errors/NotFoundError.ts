import { AppError } from "./AppError";

export class NotFoundError extends AppError {
  public readonly statusCode = 404;

  constructor(resource = "Resource") {
    super(`${resource} not found`);
  }
}
