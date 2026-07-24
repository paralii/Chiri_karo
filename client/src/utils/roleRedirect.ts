import { UserRole } from "../types/auth.types";

/**
 * Central place to decide where a user lands after authenticating.
 * All roles currently resolve to the same shared dashboard shell —
 * DashboardPage itself renders role-aware content (see below) since
 * there aren't yet separate domain routes (appointments/patients/etc.)
 * to send each role to. Once those exist, branch here instead of in
 * the dashboard component.
 */
export const getRoleLandingPath = (role: UserRole): string => {
  switch (role) {
    case "admin":
      return "/dashboard";
    case "dentist":
      return "/dashboard";
    case "receptionist":
      return "/dashboard";
    case "patient":
      return "/dashboard";
    default:
      return "/dashboard";
  }
};
