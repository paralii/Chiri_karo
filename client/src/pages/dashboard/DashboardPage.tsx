import { Link } from "react-router-dom";
import { UserPlus, CalendarDays, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  StatusPill,
  Button,
} from "../../components/ui";
import { useAppSelector } from "../../store/hooks";
import { selectAuthUser } from "../../store/selectors/auth.selectors";

const AdminQuickActions = () => (
  <Card>
    <CardHeader>
      <CardTitle>Clinic Management</CardTitle>
    </CardHeader>

    <CardContent className="flex flex-col gap-3">
      <p className="text-sm text-ink-500">
        Invite and manage clinics in the system.
      </p>

      <Link to="/dashboard/admin/clinics">
        <Button>
          <UserPlus className="h-4 w-4" />
          Manage Clinics
        </Button>
      </Link>
    </CardContent>
  </Card>
);

const ClinicQuickActions = () => (
  <Card>
    <CardHeader>
      <CardTitle>Patient Management</CardTitle>
    </CardHeader>

    <CardContent className="flex flex-col gap-3">
      <p className="text-sm text-ink-500">
        Invite and manage patients for your clinic.
      </p>

      <Link to="/dashboard/clinic/patients">
        <Button>
          <Users className="h-4 w-4" />
          Manage Patients
        </Button>
      </Link>
    </CardContent>
  </Card>
);
const StaffQuickActions = (): JSX.Element => (
  <Card>
    <CardHeader>
      <CardTitle>Today&apos;s schedule</CardTitle>
    </CardHeader>
    <CardContent className="flex items-center gap-3">
      <CalendarDays className="h-5 w-5 text-secondary" />
      <p className="text-sm text-ink-500">
        Appointment scheduling isn&apos;t built yet — check back soon.
      </p>
    </CardContent>
  </Card>
);

const PatientQuickActions = (): JSX.Element => (
  <Card>
    <CardHeader>
      <CardTitle>Book an appointment</CardTitle>
    </CardHeader>
    <CardContent className="flex items-center gap-3">
      <Users className="h-5 w-5 text-primary" />
      <p className="text-sm text-ink-500">
        Appointment booking isn&apos;t built yet — check back soon.
      </p>
    </CardContent>
  </Card>
);

export const DashboardPage = (): JSX.Element => {
  const user = useAppSelector(selectAuthUser);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-xl font-semibold text-ink-900">
          Welcome back{user ? `, ${user.name.split(" ")[0]}` : ""}
        </h1>
        <p className="text-sm text-ink-500">
          Here&apos;s what&apos;s happening in your clinic today.
        </p>
      </div>

      {/* <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Today&apos;s appointments</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <span className="font-display text-3xl font-semibold text-ink-900">
              0
            </span>
            <StatusPill status="info" label="No data yet" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active patients</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <span className="font-display text-3xl font-semibold text-ink-900">
              0
            </span>
            <StatusPill status="neutral" label="No data yet" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending confirmations</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <span className="font-display text-3xl font-semibold text-ink-900">
              0
            </span>
            <StatusPill status="pending" label="No data yet" />
          </CardContent>
        </Card>
      </div> */}

      {user?.role === "admin" && <AdminQuickActions />}
      {(user?.role === "clinic" || user?.role === "receptionist") && (
        <ClinicQuickActions />
      )}
      {user?.role === "patient" && <PatientQuickActions />}
    </div>
  );
};
