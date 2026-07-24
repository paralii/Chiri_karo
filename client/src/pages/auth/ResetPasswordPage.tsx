import { FormEvent, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AxiosError } from "axios";
import { AuthLayout } from "../../components/auth/AuthLayout";
import { Button, Input, Alert } from "../../components/ui";
import { useResetPasswordMutation } from "../../hooks/useAuthMutations";
import { getPasswordHint, isValidPassword } from "../../utils/validators";
import { ApiErrorResponse } from "../../types/api.types";

interface FieldErrors {
  password?: string;
  confirmPassword?: string;
}

export const ResetPasswordPage = (): JSX.Element => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const resetPasswordMutation = useResetPasswordMutation();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  const validate = (): boolean => {
    const errors: FieldErrors = {};
    if (!isValidPassword(password)) {
      errors.password = getPasswordHint();
    }
    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    setFormError(null);

    if (!token) {
      setFormError("Reset link is missing or invalid.");
      return;
    }

    if (!validate()) {
      return;
    }

    try {
      await resetPasswordMutation.mutateAsync({ token, password });
      navigate("/login", { replace: true, state: { passwordReset: true } });
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      setFormError(
        axiosError.response?.data?.message ??
          "Unable to reset password. The link may have expired.",
      );
    }
  };

  return (
    <AuthLayout
      title="Set a new password"
      subtitle="Choose a strong password for your account."
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
        {formError && <Alert variant="danger">{formError}</Alert>}

        <Input
          label="New password"
          type="password"
          name="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={fieldErrors.password}
          hint={!fieldErrors.password ? getPasswordHint() : undefined}
          placeholder="••••••••"
        />

        <Input
          label="Confirm new password"
          type="password"
          name="confirmPassword"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={fieldErrors.confirmPassword}
          placeholder="••••••••"
        />

        <Button
          type="submit"
          className="mt-1 w-full"
          isLoading={resetPasswordMutation.isPending}
        >
          Reset password
        </Button>

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
