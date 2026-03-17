import axiosClient from "@/lib/axios";

export async function getAreaList() {
  const response = await axiosClient.get("/areas/list");
  return response.data;
}
