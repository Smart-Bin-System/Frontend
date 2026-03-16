import axiosClient from "@/lib/axios";

export async function getAlerts() {
  const response = await axiosClient.get("/alerts");
  return response.data;
}
