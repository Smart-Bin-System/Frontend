import axiosClient from "@/lib/axios";

export async function syncBin(binId) {
  const { data } = await axiosClient.post(`/bins/${binId}/sync`);
  return data;
}
