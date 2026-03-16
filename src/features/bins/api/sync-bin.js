import axiosClient from "@/lib/axios";

export async function syncBin(binId) {
  const response = await axiosClient.post(`/bins/${binId}/sync`);
  return response.data;
}
