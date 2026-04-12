import axiosClient from "@/lib/axios";

function formatAlertDateTime(dateTime) {
  if (!dateTime) return "N/A";

  const parsedDate = new Date(dateTime);
  if (Number.isNaN(parsedDate.getTime())) return dateTime;

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsedDate);
}

function normalizeAlert(alert, index) {
  return {
    id: alert._id || `${alert.binId || alert.binName || "BIN"}-${alert.createdAt || alert.dateTime || index}`,
    type: alert.type || alert.alertName || "Alert",
    severity: alert.severity || alert.priority || "low",
    message: alert.message || alert.briefDescription || "",
    binId: alert.binId || alert.binName || "N/A",
    area: alert.area || alert.areaName || "N/A",
    createdAt: formatAlertDateTime(alert.createdAt || alert.dateTime),
  };
}

export async function getAlerts() {
  const response = await axiosClient.get("/alerts");
  const rawAlerts = response.data?.data || response.data || [];

  if (!Array.isArray(rawAlerts)) {
    return [];
  }

  return rawAlerts.map((alert, index) => normalizeAlert(alert, index));
}
