import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { AuthLayout } from "../../components/auth/AuthLayout";
import { GoogleButton } from "../../components/auth/GoogleButton";
import { Button, Input, Alert } from "../../components/ui";
import { useRegisterMutation } from "../../hooks/useAuthMutations";
import {
  getPasswordHint,
  isValidEmail,
  isValidPassword,
} from "../../utils/validators";
import { ApiErrorResponse } from "../../types/api.types";

interface FieldErrors {
  name?: string;
  email?: string;
  password?: string;
}

export const RegisterPage = (): JSX.Element => {
  const registerMutation = useRegisterMutation();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  const validate = (): boolean => {
    const errors: FieldErrors = {};
    if (name.trim().length < 2) {
      errors.name = "Enter your full name.";
    }
    if (!isValidEmail(email)) {
      errors.email = "Enter a valid email address.";
    }
    if (!isValidPassword(password)) {
      errors.password = getPasswordHint();
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
      await registerMutation.mutateAsync({
        name: name.trim(),
        email,
        password,
      });
      navigate("/dashboard");
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      setFormError(
        axiosError.response?.data?.message ??
          "Unable to create your account. Please try again.",
      );
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Set up access to your clinic workspace."
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
        {formError && <Alert variant="danger">{formError}</Alert>}

        <Input
          label="Full name"
          type="text"
          name="name"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={fieldErrors.name}
          placeholder="Jordan Blake"
        />

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
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={fieldErrors.password}
          hint={!fieldErrors.password ? getPasswordHint() : undefined}
          placeholder="••••••••"
        />

        <Button
          type="submit"
          className="mt-1 w-full"
          isLoading={registerMutation.isPending}
        >
          Create account
        </Button>

        <div className="relative flex items-center py-1">
          <div className="h-px flex-1 bg-ink-100" />
          <span className="px-3 text-xs text-ink-500">OR</span>
          <div className="h-px flex-1 bg-ink-100" />
        </div>

        <GoogleButton />

        <p className="mt-2 text-center text-sm text-ink-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-primary hover:text-primary-600"
          >
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};
