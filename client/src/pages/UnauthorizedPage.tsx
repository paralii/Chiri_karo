import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { Button } from "../components/ui/Button";

export const UnauthorizedPage = (): JSX.Element => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-surface-sunken p-6 text-center">
      <ShieldAlert className="h-10 w-10 text-danger" />
      <h1 className="font-display text-2xl font-semibold text-ink-900">
        Access restricted
      </h1>
      <p className="max-w-sm text-sm text-ink-500">
        Your account role doesn&apos;t have permission to view this page.
        Contact your clinic administrator if you think this is a mistake.
      </p>
      <Link to="/dashboard">
        <Button variant="outline">Back to dashboard</Button>
      </Link>
    </div>
  );
};
