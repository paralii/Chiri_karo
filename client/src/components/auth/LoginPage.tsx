import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { AuthLayout } from "../../components/auth/AuthLayout";
import { GoogleButton } from "../../components/auth/GoogleButton";
import { Button, Input, Alert } from "../../components/ui";
import { useLoginMutation } from "../../hooks/useAuthMutations";
import { isValidEmail } from "../../utils/validators";
import { ApiErrorResponse } from "../../types/api.types";

interface FieldErrors {
  email?: string;
  password?: string;
}

export const LoginPage = (): JSX.Element => {
  const loginMutation = useLoginMutation();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  const validate = (): boolean => {
    const errors: FieldErrors = {};
    if (!isValidEmail(email)) {
      errors.email = "Enter a valid email address.";
    }
    if (!password) {
      errors.password = "Password is required.";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    setFormError(null);

    if (!validate()) {
      return;
    }

    try {
      await loginMutation.mutateAsync({ email, password });
      navigate("/dashboard");
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      setFormError(
        axiosError.response?.data?.message ??
          "Unable to sign in. Please try again.",
      );
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to manage your clinic.">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
        {formError && <Alert variant="danger">{formError}</Alert>}

        <Input
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={fieldErrors.email}
          placeholder="you@clinic.com"
        />

        <Input
          label="Password"
          type="password"
          name="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={fieldErrors.password}
          placeholder="••••••••"
        />

        <Button
          type="submit"
          className="mt-1 w-full"
          isLoading={loginMutation.isPending}
        >
          Sign in
        </Button>

        <div className="relative flex items-center py-1">
          <div className="h-px flex-1 bg-ink-100" />
          <span className="px-3 text-xs text-ink-500">OR</span>
          <div className="h-px flex-1 bg-ink-100" />
        </div>

        <GoogleButton />

        <p className="mt-2 text-center text-sm text-ink-500">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-primary hover:text-primary-600"
          >
            Create one
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};
