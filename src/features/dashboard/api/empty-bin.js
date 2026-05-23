import axiosClient from "@/lib/axios";

export async function emptyBinDirectly(binId) {
  const response = await axiosClient.post(`/tasks/bin/${binId}/empty`);
  return response.data;
}
