import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import { selectAuthUser } from "../../store/selectors/auth.selectors";
import { UserRole } from "../../types/auth.types";

export interface RoleGuardProps {
  allowedRoles: UserRole[];
}

export const RoleGuard = ({ allowedRoles }: RoleGuardProps): JSX.Element => {
  const user = useAppSelector(selectAuthUser);
  console.log(user);
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};
