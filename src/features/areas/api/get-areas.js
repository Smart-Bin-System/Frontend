import axiosClient from "@/lib/axios";

export async function getAreas() {
  const response = await axiosClient.get("/areas");
  return response.data;
}
