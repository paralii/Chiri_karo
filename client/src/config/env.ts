export interface AppEnv {
  apiBaseUrl: string;
  appName: string;
}

const requireEnv = (key: keyof ImportMetaEnv): string => {
  const value = import.meta.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const appEnv: AppEnv = {
  apiBaseUrl: requireEnv("VITE_API_BASE_URL"),
  appName: import.meta.env.VITE_APP_NAME || "Dental Clinic Management System",
};
