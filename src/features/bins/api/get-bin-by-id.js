import axiosClient from "@/lib/axios";

function formatDateTime(value) {
  if (!value) return "N/A";

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) return value;

  return parsedDate.toLocaleString();
}

function normalizeBinDetails(apiBin) {
  if (!apiBin || typeof apiBin !== "object") {
    return {
      publicId: "N/A",
      name: "Unknown Bin",
      description: "",
      status: "offline",
      fillLevel: 0,
      lastSeen: "N/A",
      areaName: "Unassigned",
      compartments: [],
      device: {},
      location: {},
    };
  }

  const compartmentFillLevels = Array.isArray(apiBin.compartments)
    ? apiBin.compartments
        .map((compartment) => Number(compartment?.fillLevel ?? compartment?.fillPercent))
        .filter((value) => Number.isFinite(value))
    : [];

  const directFillLevel = Number(apiBin.fillLevel);
  const resolvedFillLevel = Number.isFinite(directFillLevel)
    ? directFillLevel
    : compartmentFillLevels.length > 0
      ? Math.max(...compartmentFillLevels)
      : 0;

  const normalizedStatus =
    typeof apiBin.status === "object"
      ? apiBin.status?.isOnline
        ? "online"
        : "offline"
      : String(apiBin.status || "offline").toLowerCase() === "online"
        ? "online"
        : "offline";

  const normalizedCompartments = Array.isArray(apiBin.compartments)
    ? apiBin.compartments.map((compartment) => ({
        ...compartment,
        type: compartment.type || compartment.name || "Unknown",
        fillLevel: Number.isFinite(Number(compartment.fillLevel ?? compartment.fillPercent))
          ? Number(compartment.fillLevel ?? compartment.fillPercent)
          : 0,
      }))
    : [];

  return {
    ...apiBin,
    status: normalizedStatus,
    fillLevel: Math.min(Math.max(Math.round(resolvedFillLevel), 0), 100),
    lastSeen: formatDateTime(apiBin.lastSeen || apiBin.status?.lastSeenAt),
    areaName: apiBin.areaId?.name || "Unassigned",
    compartments: normalizedCompartments,
  };
}

export async function getBinById(binId) {
  const response = await axiosClient.get(`/bins/${binId}`);
  const apiBin = response.data?.data || response.data;
  return normalizeBinDetails(apiBin);
}
