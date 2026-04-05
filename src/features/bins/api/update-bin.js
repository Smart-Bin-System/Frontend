import axiosClient from "@/lib/axios";

export async function updateBin(binId, values) {
  const hasLatitude =
    values.latitude !== undefined &&
    values.latitude !== null &&
    String(values.latitude).trim() !== "";

  const hasLongitude =
    values.longitude !== undefined &&
    values.longitude !== null &&
    String(values.longitude).trim() !== "";

  const geo =
    hasLatitude && hasLongitude
      ? {
          type: "Point",
          coordinates: [Number(values.longitude), Number(values.latitude)],
        }
      : null;

  const payload = {
    name: values.name,
    description: values.description || "",
    areaId: values.areaId,
    location: {
      address: values.address || "",
      geo,
    },
    assignedAdminId: values.assignedAdminId?.trim() || null,
    assignedWorkerId: values.assignedWorkerId?.trim() || null,
  };

  const response = await axiosClient.put(`/bins/${binId}`, payload);
  return response.data;
}
