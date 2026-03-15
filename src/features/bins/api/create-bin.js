import axiosClient from "@/lib/axios";

export async function createBin(payload) {
  const response = await axiosClient.post("/bins", payload);
  return response.data;
}
