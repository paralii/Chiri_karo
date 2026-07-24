import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../../hooks/useAuthMutations";
import { Button } from "../ui/Button";

export const Topbar = (): JSX.Element => {
  const logoutMutation = useLogoutMutation();
  const navigate = useNavigate();

  const handleLogout = async (): Promise<void> => {
    await logoutMutation.mutateAsync();
    navigate("/login", { replace: true });
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-ink-100 bg-surface-raised px-6">
      <span className="font-display text-sm font-medium text-ink-500">
        Clinic Workspace
      </span>
      <Button
        variant="ghost"
        size="sm"
        isLoading={logoutMutation.isPending}
        onClick={() => void handleLogout()}
      >
        <LogOut className="h-4 w-4" />
        Sign out
      </Button>
    </header>
  );
};
