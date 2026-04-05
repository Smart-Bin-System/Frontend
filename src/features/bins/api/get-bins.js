import axiosClient from "@/lib/axios";

function formatLastSeen(value) {
  if (!value) return "N/A";

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) return value;

  return parsedDate.toLocaleString();
}

function normalizeBinSummary(bin) {
  const compartmentFillLevels = Array.isArray(bin.compartments)
    ? bin.compartments
        .map((compartment) => Number(compartment?.fillPercent))
        .filter((value) => Number.isFinite(value))
    : [];

  const directFillLevel = Number(bin.fillLevel);
  const resolvedFillLevel = Number.isFinite(directFillLevel)
    ? directFillLevel
    : compartmentFillLevels.length > 0
      ? Math.max(...compartmentFillLevels)
      : 0;

  const statusValue =
    typeof bin.status === "object"
      ? bin.status?.isOnline
        ? "online"
        : "offline"
      : String(bin.status || "offline").toLowerCase() === "online"
        ? "online"
        : "offline";

  return {
    ...bin,
    publicId: bin.publicId || "N/A",
    name: bin.name || "Unnamed Bin",
    areaName: bin.areaId?.name || "Unassigned",
    status: statusValue,
    fillLevel: Math.min(Math.max(Math.round(resolvedFillLevel), 0), 100),
    lastSeen: formatLastSeen(bin.lastSeen || bin.status?.lastSeenAt),
  };
}

export async function getBins() {
  const response = await axiosClient.get("/bins");

  const responseBins = Array.isArray(response.data?.data)
    ? response.data.data
    : Array.isArray(response.data)
      ? response.data
      : [];

  return responseBins.map(normalizeBinSummary);
}
