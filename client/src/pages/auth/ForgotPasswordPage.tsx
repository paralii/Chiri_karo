import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { AxiosError } from "axios";
import { AuthLayout } from "../../components/auth/AuthLayout";
import { Button, Input, Alert } from "../../components/ui";
import { useForgotPasswordMutation } from "../../hooks/useAuthMutations";
import { isValidEmail } from "../../utils/validators";
import { ApiErrorResponse } from "../../types/api.types";

export const ForgotPasswordPage = (): JSX.Element => {
  const forgotPasswordMutation = useForgotPasswordMutation();

  const [email, setEmail] = useState("");
  const [fieldError, setFieldError] = useState<string | undefined>();
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    setFormError(null);

    if (!isValidEmail(email)) {
      setFieldError("Enter a valid email address.");
      return;
    }
    setFieldError(undefined);

    try {
      await forgotPasswordMutation.mutateAsync({ email });
      setIsSubmitted(true);
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      setFormError(
        axiosError.response?.data?.message ??
          "Something went wrong. Please try again.",
      );
    }
  };

  return (
    <AuthLayout
      title="Forgot password"
      subtitle="We'll email you a link to reset it."
    >
      {isSubmitted ? (
        <div className="flex flex-col gap-4">
          <Alert variant="success" title="Check your inbox">
            If an account exists for {email}, a password reset link is on its
            way.
          </Alert>
          <Link
            to="/login"
            className="text-center text-sm font-medium text-primary hover:text-primary-600"
          >
            Back to sign in
          </Link>
        </div>
      ) : (
        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit}
          noValidate
        >
          {formError && <Alert variant="danger">{formError}</Alert>}
          {/* {fieldError && <Alert variant="danger">{fieldError}</Alert>} */}

          <Input
            label="Email"
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={fieldError}
            placeholder="you@clinic.com"
          />

          <Button
            type="submit"
            className="mt-1 w-full"
            isLoading={forgotPasswordMutation.isPending}
          >
            Send reset link
          </Button>

          <p className="text-center text-sm text-ink-500">
            Remembered it?{" "}
            <Link
              to="/login"
              className="font-medium text-primary hover:text-primary-600"
            >
              Back to sign in
            </Link>
          </p>
        </form>
      )}
    </AuthLayout>
  );
};
