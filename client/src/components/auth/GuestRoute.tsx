import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import {
  selectIsAuthenticated,
  selectIsInitializing,
} from "../../store/selectors/auth.selectors";
import { Spinner } from "../ui/Spinner";

export const GuestRoute = (): JSX.Element => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isInitializing = useAppSelector(selectIsInitializing);

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-sunken">
        <Spinner size={28} />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
