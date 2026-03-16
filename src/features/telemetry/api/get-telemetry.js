import axiosClient from "@/lib/axios";

export async function getTelemetry() {
  const response = await axiosClient.get("/telemetry");
  return response.data;
}
