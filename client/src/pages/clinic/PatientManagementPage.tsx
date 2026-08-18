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
  StatusPill,
} from "../../components/ui";
import { useInvitePatientMutation } from "../../hooks/useAuthMutations";
import { isValidEmail } from "../../utils/validators";
import { ApiErrorResponse } from "../../types/api.types";

interface FieldErrors {
  name?: string;
  email?: string;
}

export const PatientManagementPage = (): JSX.Element => {
  const invitePatientMutation = useInvitePatientMutation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const validate = (): boolean => {
    const errors: FieldErrors = {};

    if (name.trim().length < 2) {
      errors.name = "Enter the patient's full name.";
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
      await invitePatientMutation.mutateAsync({
        name: name.trim(),
        email,
      });

      setSuccessMessage(`Invitation sent to ${email}.`);

      setName("");
      setEmail("");
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;

      setFormError(
        axiosError.response?.data?.message ??
          "Unable to send invitation. Please try again.",
      );
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-xl font-semibold text-ink-900">
          Patient Management
        </h1>

        <p className="text-sm text-ink-500">
          Invite patients and manage patient access for your clinic.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invite Patient</CardTitle>
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
              label="Patient name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={fieldErrors.name}
              placeholder="John Doe"
            />

            <Input
              label="Patient email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={fieldErrors.email}
              placeholder="john@example.com"
            />

            <Button
              type="submit"
              isLoading={invitePatientMutation.isPending}
            >
              Invite Patient
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Patients</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="border-b border-ink-100">
                <tr>
                  <th className="py-3 text-left">Name</th>
                  <th className="py-3 text-left">Email</th>
                  <th className="py-3 text-left">Status</th>
                  <th className="py-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {/* Replace with real patient data */}
                <tr className="border-b border-ink-100">
                  <td className="py-4">John Doe</td>
                  <td>john@example.com</td>
                  <td>
                    <StatusPill status="success" label="Active" />
                  </td>
                  <td className="flex justify-end gap-2 py-4">
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>

                    <Button size="sm" variant="ghost">
                      Deactivate
                    </Button>
                  </td>
                </tr>

                <tr className="border-b border-ink-100">
                  <td className="py-4">Jane Smith</td>
                  <td>jane@example.com</td>
                  <td>
                    <StatusPill status="pending" label="Pending" />
                  </td>
                  <td className="flex justify-end gap-2 py-4">
                    <Button size="sm" variant="outline">
                      Resend Invite
                    </Button>

                    <Button size="sm" variant="ghost">
                     Delete
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};