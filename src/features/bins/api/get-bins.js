import axiosClient from "@/lib/axios";

export async function getBins() {
  const response = await axiosClient.get("/bins");
  return response.data;
}
