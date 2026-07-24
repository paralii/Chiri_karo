import { FormEvent, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { AuthLayout } from "../../components/auth/AuthLayout";
import { Button, Alert, OtpInput } from "../../components/ui";
import {
  useResendOtpMutation,
  useVerifyOtpMutation,
} from "../../hooks/useAuthMutations";
import { ApiErrorResponse } from "../../types/api.types";

const RESEND_COOLDOWN_SECONDS = 60;

interface LocationState {
  email?: string;
}

export const OtpVerifyPage = (): JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = (location.state as LocationState | null)?.email ?? "";

  const verifyMutation = useVerifyOtpMutation();
  const resendMutation = useResendOtpMutation();

  const [code, setCode] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  useEffect(() => {
    if (!email) {
      navigate("/register", { replace: true });
    }
  }, [email, navigate]);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    setFormError(null);
    setSuccessMessage(null);

    if (code.length !== 6) {
      setFormError("Enter the 6-digit code sent to your email.");
      return;
    }

    try {
      await verifyMutation.mutateAsync({ email, code });
      navigate("/login", { replace: true, state: { verified: true } });
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      setFormError(
        axiosError.response?.data?.message ??
          "Verification failed. Please try again.",
      );
    }
  };

  const handleResend = async (): Promise<void> => {
    setFormError(null);
    setSuccessMessage(null);

    try {
      await resendMutation.mutateAsync({ email });
      setSuccessMessage("A new code has been sent to your email.");
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      setFormError(
        axiosError.response?.data?.message ??
          "Unable to resend code right now.",
      );
    }
  };

  return (
    <AuthLayout
      title="Verify your email"
      subtitle={`Enter the code we sent to ${email || "your email"}.`}
    >
      <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
        {formError && <Alert variant="danger">{formError}</Alert>}
        {successMessage && <Alert variant="success">{successMessage}</Alert>}

        <OtpInput
          value={code}
          onChange={setCode}
          disabled={verifyMutation.isPending}
        />

        <Button
          type="submit"
          className="w-full"
          isLoading={verifyMutation.isPending}
        >
          Verify email
        </Button>

        <div className="text-center text-sm text-ink-500">
          Didn&apos;t get a code?{" "}
          <button
            type="button"
            onClick={() => void handleResend()}
            disabled={cooldown > 0 || resendMutation.isPending}
            className="font-medium text-primary hover:text-primary-600 disabled:cursor-not-allowed disabled:text-ink-300"
          >
            {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
          </button>
        </div>

        <p className="text-center text-sm text-ink-500">
          <Link
            to="/login"
            className="font-medium text-primary hover:text-primary-600"
          >
            Back to sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};
