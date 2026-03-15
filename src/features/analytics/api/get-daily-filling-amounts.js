import axiosClient from "@/lib/axios";

export async function getDailyFillingAmounts() {
  const response = await axiosClient.get("/analytics/daily-filling-amounts");
  return response.data;
}
