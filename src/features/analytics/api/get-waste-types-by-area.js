import axiosClient from "@/lib/axios";

export async function getWasteTypesByArea() {
  const response = await axiosClient.get("/analytics/waste-types-by-area");
  return response.data;
}
