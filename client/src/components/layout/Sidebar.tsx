import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Stethoscope,
  UserPlus,
} from "lucide-react";
import { cn } from "../../lib/cn";
import { useAppSelector } from "../../store/hooks";
import { selectAuthUser } from "../../store/selectors/auth.selectors";
import { UserRole } from "../../types/auth.types";

interface NavItem {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  roles?: UserRole[];
}

const navItems: NavItem[] = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  {
  to: "/dashboard/admin/clinics",
  label: "Clinics",
  icon: UserPlus,
  roles: ["admin"],
},
  // { to: "/dashboard/appointments", label: "Appointments", icon: CalendarDays, roles: ["dentist", "receptionist"] },
  {
    to: "/dashboard/clinic/patients",
    label: "Patients",
    icon: Users,
    roles: ["clinic", "receptionist"],
  },
];

export const Sidebar = (): JSX.Element => {
  const user = useAppSelector(selectAuthUser);

  const visibleItems = navItems.filter(
    (item) => !item.roles || (user && item.roles.includes(user.role)),
  );

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-ink-100 bg-surface-raised p-4 lg:flex">
      <div className="mb-6 flex items-center gap-2 px-2">
        <Stethoscope className="h-5 w-5 text-primary" />
        <span className="font-display text-sm font-semibold text-ink-900">
          Chirikaro
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {visibleItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/dashboard"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2.5 rounded-sm px-3 py-2 text-sm font-medium text-ink-700 transition-colors",
                "hover:bg-ink-100",
                isActive && "bg-primary-50 text-primary-700",
              )
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      {user && (
        <div className="mt-auto flex items-center gap-2.5 rounded-sm border border-ink-100 px-3 py-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-medium text-ink-900">
              {user.name}
            </span>
            <span className="truncate text-xs capitalize text-ink-500">
              {user.role}
            </span>
          </div>
        </div>
      )}
    </aside>
  );
};
