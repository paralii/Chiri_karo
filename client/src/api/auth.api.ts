import { httpClient } from "../lib/axios";
import { ApiSuccessResponse } from "../types/api.types";
import {
  AcceptInvitePayload,
  AuthResponseData,
  AuthUser,
  ForgotPasswordPayload,
  InviteAdminPayload,
  invitePatientPayload,
  LoginPayload,
  RegisterPayload,
  ResendOtpPayload,
  ResetPasswordPayload,
  VerifyOtpPayload,
} from "../types/auth.types";

export const registerRequest = async (
  payload: RegisterPayload,
): Promise<AuthResponseData> => {
  const { data } = await httpClient.post<ApiSuccessResponse<AuthResponseData>>(
    "/auth/register",
    payload,
  );
  if (!data.data) {
    throw new Error("Malformed register response");
  }
  return data.data;
};

export const loginRequest = async (
  payload: LoginPayload,
): Promise<AuthResponseData> => {
  const { data } = await httpClient.post<ApiSuccessResponse<AuthResponseData>>(
    "/auth/login",
    payload,
  );
  if (!data.data) {
    throw new Error("Malformed login response");
  }
  return data.data;
};

export const refreshRequest = async (): Promise<string> => {
  const { data } =
    await httpClient.post<ApiSuccessResponse<{ accessToken: string }>>(
      "/auth/refresh",
    );
  if (!data.data) {
    throw new Error("Malformed refresh response");
  }
  return data.data.accessToken;
};

export const logoutRequest = async (): Promise<void> => {
  await httpClient.post("/auth/logout");
};

export const getProfileRequest = async (): Promise<AuthUser> => {
  const { data } =
    await httpClient.get<ApiSuccessResponse<AuthUser>>("/auth/me");
  if (!data.data) {
    throw new Error("Malformed profile response");
  }
  return data.data;
};

export const verifyOtpRequest = async (
  payload: VerifyOtpPayload,
): Promise<void> => {
  await httpClient.post("/auth/otp/verify", payload);
};

export const resendOtpRequest = async (
  payload: ResendOtpPayload,
): Promise<void> => {
  await httpClient.post("/auth/otp/resend", payload);
};

export const forgotPasswordRequest = async (
  payload: ForgotPasswordPayload,
): Promise<void> => {
  await httpClient.post("/auth/forgot-password", payload);
};

export const resetPasswordRequest = async (
  payload: ResetPasswordPayload,
): Promise<void> => {
  await httpClient.post("/auth/reset-password", payload);
};

export const inviteAdminRequest = async (
  payload: InviteAdminPayload,
): Promise<void> => {
  await httpClient.post("/auth/admin/invite", payload);
};

export const invitePatientRequest = async (
  payload: invitePatientPayload,
): Promise<void> => {
  await httpClient.post("/auth/clinic/patients", payload);
};

export const acceptInviteRequest = async (
  payload: AcceptInvitePayload,
): Promise<AuthResponseData> => {
  const { data } = await httpClient.post<ApiSuccessResponse<AuthResponseData>>(
    "/auth/accept-invite",
    payload,
  );
  if (!data.data) {
    throw new Error("Malformed accept-invite response");
  }
  return data.data;
};
