import { env } from "@infrastructure/config/env";

export interface EmailConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  fromName: string;
  fromEmail: string;
}

export const emailConfig: EmailConfig = {
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  user: env.SMTP_USER,
  password: env.SMTP_PASSWORD,
  fromName: env.SMTP_FROM_NAME,
  fromEmail: env.SMTP_FROM_EMAIL,
};
