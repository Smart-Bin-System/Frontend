import axiosClient from "@/lib/axios";

export async function getBinById(binId) {
  const response = await axiosClient.get(`/bins/${binId}`);
  return response.data;
}
