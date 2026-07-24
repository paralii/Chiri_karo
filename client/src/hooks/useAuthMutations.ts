import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import {
  acceptInviteRequest,
  forgotPasswordRequest,
  inviteAdminRequest,
  loginRequest,
  logoutRequest,
  registerRequest,
  resendOtpRequest,
  resetPasswordRequest,
  verifyOtpRequest,
} from "../api/auth.api";
import { tokenStore } from "../lib/tokenStore";
import { useAppDispatch } from "../store/hooks";
import { clearSession, setSession } from "../store/slices/auth.slice";
import {
  AcceptInvitePayload,
  AuthResponseData,
  ForgotPasswordPayload,
  InviteAdminPayload,
  LoginPayload,
  RegisterPayload,
  ResendOtpPayload,
  ResetPasswordPayload,
  VerifyOtpPayload,
} from "../types/auth.types";

export const useLoginMutation = (): UseMutationResult<
  AuthResponseData,
  unknown,
  LoginPayload
> => {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (payload: LoginPayload) => loginRequest(payload),
    onSuccess: (result) => {
      tokenStore.setAccessToken(result.accessToken);
      dispatch(setSession(result.user));
    },
  });
};

export const useRegisterMutation = (): UseMutationResult<
  AuthResponseData,
  unknown,
  RegisterPayload
> => {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (payload: RegisterPayload) => registerRequest(payload),
    onSuccess: (result) => {
      tokenStore.setAccessToken(result.accessToken);
      dispatch(setSession(result.user));
    },
  });
};

export const useLogoutMutation = (): UseMutationResult<void, unknown, void> => {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: () => logoutRequest(),
    onSettled: () => {
      dispatch(clearSession());
    },
  });
};

export const useVerifyOtpMutation = (): UseMutationResult<
  void,
  unknown,
  VerifyOtpPayload
> => {
  return useMutation({
    mutationFn: (payload: VerifyOtpPayload) => verifyOtpRequest(payload),
  });
};

export const useResendOtpMutation = (): UseMutationResult<
  void,
  unknown,
  ResendOtpPayload
> => {
  return useMutation({
    mutationFn: (payload: ResendOtpPayload) => resendOtpRequest(payload),
  });
};

export const useForgotPasswordMutation = (): UseMutationResult<
  void,
  unknown,
  ForgotPasswordPayload
> => {
  return useMutation({
    mutationFn: (payload: ForgotPasswordPayload) =>
      forgotPasswordRequest(payload),
  });
};

export const useResetPasswordMutation = (): UseMutationResult<
  void,
  unknown,
  ResetPasswordPayload
> => {
  return useMutation({
    mutationFn: (payload: ResetPasswordPayload) =>
      resetPasswordRequest(payload),
  });
};

export const useInviteAdminMutation = (): UseMutationResult<
  void,
  unknown,
  InviteAdminPayload
> => {
  return useMutation({
    mutationFn: (payload: InviteAdminPayload) => inviteAdminRequest(payload),
  });
};

export const useAcceptInviteMutation = (): UseMutationResult<
  AuthResponseData,
  unknown,
  AcceptInvitePayload
> => {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (payload: AcceptInvitePayload) => acceptInviteRequest(payload),
    onSuccess: (result) => {
      tokenStore.setAccessToken(result.accessToken);
      dispatch(setSession(result.user));
    },
  });
};
