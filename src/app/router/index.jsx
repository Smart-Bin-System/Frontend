import { Navigate, Route, Routes } from "react-router";
import AppLayout from "@/components/layout/app-layout";
import DashboardPage from "@/features/dashboard/pages/dashboard-page";
import AreasPage from "@/features/areas/pages/areas-page";
import BinsPage from "@/features/bins/pages/bins-page";
import BinDetailsPage from "@/features/bins/pages/bin-details-page";
import AlertsPage from "@/features/alerts/pages/alerts-page";
import TelemetryPage from "@/features/telemetry/pages/telemetry-page";
import AnalyticsPage from "@/features/analytics/pages/analytics-page";

function PlaceholderPage({ title }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
      <p className="mt-2 text-sm text-slate-600">
        This module will be implemented next for Mihashi&apos;s Smart Waste Management System.
      </p>
    </div>
  );
}

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="areas" element={<AreasPage />} />
        <Route path="bins" element={<BinsPage />} />
        <Route path="bins/:binId" element={<BinDetailsPage />} />
        <Route path="telemetry" element={<TelemetryPage />} />
        <Route path="alerts" element={<AlertsPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="settings" element={<PlaceholderPage title="Settings" />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default AppRouter;
