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

export const ClinicManagementPage = (): JSX.Element => {
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
    <div className="flex flex-col gap-6">
      <div>
    <h1 className="font-display text-xl font-semibold text-ink-900">
      Clinic Management
    </h1>
    <p className="text-sm text-ink-500">
      Invite new clinics and manage existing clinic accounts.
    </p>
  </div>

      <Card>
        <CardHeader>
          <CardTitle>New Clinic admin invite</CardTitle>
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

      <Card>
  <CardHeader>
    <CardTitle>Clinics</CardTitle>
  </CardHeader>

  <CardContent>
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="border-b border-ink-100">
          <tr>
            <th className="py-3 text-left">Clinic</th>
            <th className="py-3 text-left">Email</th>
            <th className="py-3 text-left">Status</th>
            <th className="py-3 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {/* map clinics here */}
        </tbody>
      </table>
    </div>
  </CardContent>
</Card>

    </div>
  );
};
