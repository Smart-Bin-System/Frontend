import axiosClient from "@/lib/axios";

export async function deleteArea(areaId) {
  const response = await axiosClient.delete(`/areas/${areaId}`);
  return response.data;
}
