import { FormEvent, useState } from "react";
import { AxiosError } from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Alert,
} from "../../components/ui";
import { useInviteAdminMutation } from "../../hooks/useAuthMutations";
import { isValidEmail } from "../../utils/validators";
import { ApiErrorResponse } from "../../types/api.types";

interface FieldErrors {
  name?: string;
  email?: string;
}

export const InviteAdminPage = (): JSX.Element => {
  const inviteAdminMutation = useInviteAdminMutation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const validate = (): boolean => {
    const errors: FieldErrors = {};
    if (name.trim().length < 2) {
      errors.name = "Enter a full name.";
    }
    if (!isValidEmail(email)) {
      errors.email = "Enter a valid email address.";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    setFormError(null);
    setSuccessMessage(null);

    if (!validate()) {
      return;
    }

    try {
      await inviteAdminMutation.mutateAsync({ name: name.trim(), email });
      setSuccessMessage(`Invite sent to ${email}.`);
      setName("");
      setEmail("");
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      setFormError(
        axiosError.response?.data?.message ??
          "Unable to send invite. Please try again.",
      );
    }
  };

  return (
    <div className="flex max-w-lg flex-col gap-6">
      <div>
        <h1 className="font-display text-xl font-semibold text-ink-900">
          Invite a clinic admin
        </h1>
        <p className="text-sm text-ink-500">
          They&apos;ll receive an email to set up their password.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New admin invite</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit}
            noValidate
          >
            {formError && <Alert variant="danger">{formError}</Alert>}
            {successMessage && (
              <Alert variant="success">{successMessage}</Alert>
            )}

            <Input
              label="Full name"
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={fieldErrors.name}
              placeholder="Jordan Blake"
            />

            <Input
              label="Email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={fieldErrors.email}
              placeholder="admin@clinic.com"
            />

            <Button type="submit" isLoading={inviteAdminMutation.isPending}>
              Send invite
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
