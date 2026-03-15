import axiosClient from "@/lib/axios";

export async function createArea(payload) {
  const response = await axiosClient.post("/areas", payload);
  return response.data;
}
