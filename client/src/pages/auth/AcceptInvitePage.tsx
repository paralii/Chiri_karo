import { FormEvent, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AxiosError } from "axios";
import { AuthLayout } from "../../components/auth/AuthLayout";
import { Button, Input, Alert } from "../../components/ui";
import { useAcceptInviteMutation } from "../../hooks/useAuthMutations";
import { getPasswordHint, isValidPassword } from "../../utils/validators";
import { getRoleLandingPath } from "../../utils/roleRedirect";
import { ApiErrorResponse } from "../../types/api.types";

interface FieldErrors {
  password?: string;
  confirmPassword?: string;
}

export const AcceptInvitePage = (): JSX.Element => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const acceptInviteMutation = useAcceptInviteMutation();
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
      setFormError("Invite link is missing or invalid.");
      return;
    }

    if (!validate()) {
      return;
    }

    try {
      const result = await acceptInviteMutation.mutateAsync({
        token,
        password,
      });
      navigate(getRoleLandingPath(result.user.role), { replace: true });
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      setFormError(
        axiosError.response?.data?.message ??
          "Unable to set up your account. The invite may have expired.",
      );
    }
  };

  return (
    <AuthLayout
      title="Set up your account"
      subtitle="Choose a password to activate your admin access."
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
        {formError && <Alert variant="danger">{formError}</Alert>}

        <Input
          label="Password"
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
          label="Confirm password"
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
          isLoading={acceptInviteMutation.isPending}
        >
          Activate account
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
