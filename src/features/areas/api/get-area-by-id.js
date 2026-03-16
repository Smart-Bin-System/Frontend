import axiosClient from "@/lib/axios";

export async function getAreaById(areaId) {
  const response = await axiosClient.get(`/areas/${areaId}`);
  return response.data;
}
