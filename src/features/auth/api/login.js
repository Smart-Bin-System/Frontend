import axiosClient from "@/lib/axios";

export async function loginUser(payload) {
  const response = await axiosClient.post("/auth/login", payload);
  return response.data;
}
