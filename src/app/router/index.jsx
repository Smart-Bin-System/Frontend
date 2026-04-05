import { Navigate, Route, Routes } from "react-router";
import PublicRoute from "@/components/auth/public-route";
import ProtectedRoute from "@/components/auth/protected-route";
import RoleRoute from "@/components/auth/role-route";
import AppLayout from "@/components/layout/app-layout";
import { PERMISSIONS } from "@/constants/permissions";
import DashboardPage from "@/features/dashboard/pages/dashboard-page";
import AreasPage from "@/features/areas/pages/areas-page";
import CreateAreaPage from "@/features/areas/pages/create-area-page";
import AreaDetailsPage from "@/features/areas/pages/area-details-page";
import EditAreaPage from "@/features/areas/pages/edit-area-page";
import BinsPage from "@/features/bins/pages/bins-page";
import CreateBinPage from "@/features/bins/pages/create-bin-page";
import BinDetailsPage from "@/features/bins/pages/bin-details-page";
import EditBinPage from "@/features/bins/pages/edit-bin-page";
import AlertsPage from "@/features/alerts/pages/alerts-page";
import TelemetryPage from "@/features/telemetry/pages/telemetry-page";
import AnalyticsPage from "@/features/analytics/pages/analytics-page";
import SettingsPage from "@/features/settings/pages/settings-page";
import ProfilePage from "@/features/profile/pages/profile-page";
import NotificationsPage from "@/features/notifications/pages/notifications-page";
import UsersPage from "@/features/users/pages/users-page";
import CreateUserPage from "@/features/users/pages/create-user-page";
import UserDetailsPage from "@/features/users/pages/user-details-page";
import EditUserPage from "@/features/users/pages/edit-user-page";
import RolesPage from "@/features/roles/pages/roles-page";
import SecurityPage from "@/features/security/pages/security-page";
import AppearancePage from "@/features/appearance/pages/appearance-page";
import LoginPage from "@/features/auth/pages/login-page";
import ForgotPasswordPage from "@/features/auth/pages/forgot-password-page";
import NotFoundPage from "@/features/system/pages/not-found-page";
import AccessDeniedPage from "@/features/system/pages/access-denied-page";

function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      <Route path="/access-denied" element={<AccessDeniedPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />

          <Route element={<RoleRoute requiredPermissions={[PERMISSIONS.VIEW_DASHBOARD]} />}>
            <Route path="dashboard" element={<DashboardPage />} />
          </Route>

          <Route element={<RoleRoute requiredPermissions={[PERMISSIONS.VIEW_AREAS]} />}>
            <Route path="areas" element={<AreasPage />} />
            <Route path="areas/:areaId" element={<AreaDetailsPage />} />
          </Route>

          <Route element={<RoleRoute requiredPermissions={[PERMISSIONS.MANAGE_AREAS]} />}>
            <Route path="areas/new" element={<CreateAreaPage />} />
            <Route path="areas/:areaId/edit" element={<EditAreaPage />} />
          </Route>

          <Route element={<RoleRoute requiredPermissions={[PERMISSIONS.VIEW_BINS]} />}>
            <Route path="bins" element={<BinsPage />} />
            <Route path="bins/:binId" element={<BinDetailsPage />} />
          </Route>

          <Route element={<RoleRoute requiredPermissions={[PERMISSIONS.MANAGE_BINS]} />}>
            <Route path="bins/new" element={<CreateBinPage />} />
            <Route path="bins/:binId/edit" element={<EditBinPage />} />
          </Route>

          <Route element={<RoleRoute requiredPermissions={[PERMISSIONS.VIEW_TELEMETRY]} />}>
            <Route path="telemetry" element={<TelemetryPage />} />
          </Route>

          <Route element={<RoleRoute requiredPermissions={[PERMISSIONS.VIEW_ALERTS]} />}>
            <Route path="alerts" element={<AlertsPage />} />
          </Route>

          <Route element={<RoleRoute requiredPermissions={[PERMISSIONS.VIEW_ANALYTICS]} />}>
            <Route path="analytics" element={<AnalyticsPage />} />
          </Route>

          <Route element={<RoleRoute requiredPermissions={[PERMISSIONS.VIEW_SETTINGS]} />}>
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          <Route element={<RoleRoute requiredPermissions={[PERMISSIONS.VIEW_PROFILE]} />}>
            <Route path="settings/profile" element={<ProfilePage />} />
          </Route>

          <Route element={<RoleRoute requiredPermissions={[PERMISSIONS.VIEW_NOTIFICATIONS]} />}>
            <Route path="settings/notifications" element={<NotificationsPage />} />
          </Route>

          <Route element={<RoleRoute requiredPermissions={[PERMISSIONS.VIEW_USERS]} />}>
            <Route path="settings/users" element={<UsersPage />} />
            <Route path="settings/users/:userId" element={<UserDetailsPage />} />
          </Route>

          <Route element={<RoleRoute requiredPermissions={[PERMISSIONS.MANAGE_USERS]} />}>
            <Route path="settings/users/new" element={<CreateUserPage />} />
            <Route path="settings/users/:userId/edit" element={<EditUserPage />} />
          </Route>

          <Route element={<RoleRoute requiredPermissions={[PERMISSIONS.VIEW_ROLES]} />}>
            <Route path="settings/roles" element={<RolesPage />} />
          </Route>

          <Route element={<RoleRoute requiredPermissions={[PERMISSIONS.VIEW_SECURITY]} />}>
            <Route path="settings/security" element={<SecurityPage />} />
          </Route>

          <Route element={<RoleRoute requiredPermissions={[PERMISSIONS.VIEW_APPEARANCE]} />}>
            <Route path="settings/appearance" element={<AppearancePage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRouter;
