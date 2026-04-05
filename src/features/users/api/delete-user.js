import axiosClient from "@/lib/axios";

export async function deleteUser(userId) {
  const response = await axiosClient.delete(`/users/${userId}`);
  return response.data;
}
