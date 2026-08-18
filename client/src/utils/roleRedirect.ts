import { UserRole } from "../types/auth.types";

export const getRoleLandingPath = (role: UserRole): string => {
  switch (role) {
    case "admin":
      return "/dashboard";
    case "clinic":
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
