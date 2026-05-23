import axiosClient from "@/lib/axios";

function ensureArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeDashboardData(payload) {
  return {
    statCards: ensureArray(payload?.statCards),
    recentAlerts: ensureArray(payload?.recentAlerts),
    areaStatus: ensureArray(payload?.areaStatus),
  };
}

export async function getDashboardData() {
  const response = await axiosClient.get("/dashboard");
  const payload = response.data?.data || response.data || {};

  return normalizeDashboardData(payload);
}
