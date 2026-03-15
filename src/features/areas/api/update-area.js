import axiosClient from "@/lib/axios";

export async function updateArea(areaId, payload) {
  const response = await axiosClient.put(`/areas/${areaId}`, payload);
  return response.data;
}
