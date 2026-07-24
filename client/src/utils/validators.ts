export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export const isValidEmail = (value: string): boolean =>
  EMAIL_REGEX.test(value.trim());

export const isValidPassword = (value: string): boolean =>
  PASSWORD_REGEX.test(value);

export const getPasswordHint = (): string =>
  "At least 8 characters, with an uppercase letter, a lowercase letter and a number.";
