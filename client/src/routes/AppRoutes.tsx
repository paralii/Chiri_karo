import { Routes, Route } from "react-router-dom";
import { HomePage } from "../pages/HomePage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { UnauthorizedPage } from "../pages/UnauthorizedPage";
import { LoginPage } from "../pages/auth/LoginPage";
import { RegisterPage } from "../pages/auth/RegisterPage";
import { OtpVerifyPage } from "../pages/auth/OtpVerifyPage";
import { ForgotPasswordPage } from "../pages/auth/ForgotPasswordPage";
import { ResetPasswordPage } from "../pages/auth/ResetPasswordPage";
import { AcceptInvitePage } from "../pages/auth/AcceptInvitePage";
import { OAuthSuccessPage } from "../pages/auth/OAuthSuccessPage";
import { DashboardPage } from "../pages/dashboard/DashboardPage";
import { ClinicManagementPage } from "../pages/admin/ClinicManagementPage";
import { ProtectedRoute } from "../components/auth/ProtectedRoute";
import { GuestRoute } from "../components/auth/GuestRoute";
import { RoleGuard } from "../components/auth/RoleGuard";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { PatientManagementPage } from "../pages/clinic/PatientManagementPage";

export const AppRoutes = (): JSX.Element => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/oauth/success" element={<OAuthSuccessPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/verify-otp" element={<OtpVerifyPage />} />

      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/accept-invite" element={<AcceptInvitePage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />

          <Route element={<RoleGuard allowedRoles={["admin"]} />}>
            <Route
              path="/dashboard/admin/clinics"
              element={<ClinicManagementPage />}
            />
          </Route>
          <Route
            element={<RoleGuard allowedRoles={["clinic", "receptionist"]} />}
          >
            {/* <Route
              path="/dashboard/clinic/patients"
              element={<PatientManagementPage />}
            /> */}
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
