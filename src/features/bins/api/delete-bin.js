import axiosClient from "@/lib/axios";

export async function deleteBin(binId) {
  const response = await axiosClient.delete(`/bins/${binId}`);
  return response.data;
}
