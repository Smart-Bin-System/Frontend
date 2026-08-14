import axiosClient from "@/lib/axios";

export async function getTelemetry({ period, search } = {}) {
  const response = await axiosClient.get("/telemetry", {
    params: {
      ...(period && period !== "today" ? { period } : {}),
      ...(search ? { search } : {}),
    },
  });
  return normalizeTelemetryResponse(response.data);
}

const ONLINE_THRESHOLD_MS = 5 * 60 * 1000;

function formatLastSeen(at) {
  if (!at) return "N/A";

  const timestamp = new Date(at).getTime();
  if (Number.isNaN(timestamp)) return "N/A";

  const diffMs = Date.now() - timestamp;
  if (diffMs < 0) return "just now";

  const diffSeconds = Math.floor(diffMs / 1000);
  if (diffSeconds < 60) return `${diffSeconds} sec ago`;

  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return `${diffMinutes} min ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hr ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
}

function getSignalStrengthLabel(rssi) {
  if (typeof rssi !== "number") return "Unknown";
  if (rssi >= -60) return `Strong (${rssi} dBm)`;
  if (rssi >= -75) return `Good (${rssi} dBm)`;
  if (rssi >= -90) return `Weak (${rssi} dBm)`;
  return `Poor (${rssi} dBm)`;
}

export function normalizeTelemetryItem(item) {
  const fillValues = (item?.compartments || [])
    .map((compartment) => Number(compartment?.fillPercent))
    .filter((value) => Number.isFinite(value));

  const fillLevel = fillValues.length
    ? Math.round(fillValues.reduce((sum, value) => sum + value, 0) / fillValues.length)
    : 0;

  const timestamp = item?.at ? new Date(item.at).getTime() : NaN;
  const isOnline = Number.isFinite(timestamp) && Date.now() - timestamp <= ONLINE_THRESHOLD_MS;
  const temperature = item?.env?.temperatureC;

  return {
    _id: item?._id,
    publicId: item?.binId?.publicId || item?.binId?._id || "Unknown Bin",
    area: item?.binId?.name || "Unassigned Bin",
    status: isOnline ? "online" : "offline",
    lastSeen: formatLastSeen(item?.at),
    temperature: Number.isFinite(temperature) ? `${temperature.toFixed(1)}°C` : "N/A",
    signalStrength: getSignalStrengthLabel(item?.connectivity?.rssi),
    fillLevel,
  };
}

export function normalizeTelemetryResponse(payload) {
  if (Array.isArray(payload?.data)) {
    return payload.data.map(normalizeTelemetryItem);
  }

  if (Array.isArray(payload)) {
    return payload.map(normalizeTelemetryItem);
  }

  return [];
}
