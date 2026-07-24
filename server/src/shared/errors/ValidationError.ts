import { AppError } from "./AppError";

export class ValidationError extends AppError {
  public readonly statusCode = 422;

  constructor(errors: Record<string, string[]>, message = "Validation failed") {
    super(message, errors);
  }
}
