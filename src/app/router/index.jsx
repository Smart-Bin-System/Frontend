import { Navigate, Route, Routes } from "react-router";
import AppLayout from "@/components/layout/app-layout";
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
import RolesPage from "@/features/roles/pages/roles-page";
import SecurityPage from "@/features/security/pages/security-page";
import AppearancePage from "@/features/appearance/pages/appearance-page";
import LoginPage from "@/features/auth/pages/login-page";
import ForgotPasswordPage from "@/features/auth/pages/forgot-password-page";

function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      <Route path="/" element={<AppLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />

        <Route path="areas" element={<AreasPage />} />
        <Route path="areas/new" element={<CreateAreaPage />} />
        <Route path="areas/:areaId" element={<AreaDetailsPage />} />
        <Route path="areas/:areaId/edit" element={<EditAreaPage />} />

        <Route path="bins" element={<BinsPage />} />
        <Route path="bins/new" element={<CreateBinPage />} />
        <Route path="bins/:binId" element={<BinDetailsPage />} />
        <Route path="bins/:binId/edit" element={<EditBinPage />} />

        <Route path="telemetry" element={<TelemetryPage />} />
        <Route path="alerts" element={<AlertsPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />

        <Route path="settings" element={<SettingsPage />} />
        <Route path="settings/profile" element={<ProfilePage />} />
        <Route path="settings/notifications" element={<NotificationsPage />} />
        <Route path="settings/users" element={<UsersPage />} />
        <Route path="settings/roles" element={<RolesPage />} />
        <Route path="settings/security" element={<SecurityPage />} />
        <Route path="settings/appearance" element={<AppearancePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default AppRouter;
