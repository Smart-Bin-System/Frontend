import axiosClient from "@/lib/axios";

export async function requestPasswordReset(payload) {
  const response = await axiosClient.post("/auth/forgot-password", payload);
  return response.data;
}
