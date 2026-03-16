import axiosClient from "@/lib/axios";

export async function getMe() {
  const response = await axiosClient.get("/auth/me");
  return response.data;
}
