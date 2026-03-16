import axiosClient from "@/lib/axios";

export async function updateBin(binId, payload) {
  const response = await axiosClient.put(`/bins/${binId}`, payload);
  return response.data;
}
