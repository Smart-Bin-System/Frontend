import axiosClient from "@/lib/axios";

export async function getAnalyticsSummary() {
  const response = await axiosClient.get("/analytics/summary");
  return response.data;
}
