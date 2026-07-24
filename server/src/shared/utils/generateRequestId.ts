import { randomUUID } from "crypto";

export const generateRequestId = (): string => randomUUID();
