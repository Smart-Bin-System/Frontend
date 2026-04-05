import axiosClient from "@/lib/axios";

export async function getUserById(userId) {
  const response = await axiosClient.get(`/users/${userId}`);
  return response.data;
}
