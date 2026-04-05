import axiosClient from "@/lib/axios";

export async function getAdmins() {
  const response = await axiosClient.get("/users/admins");
  return response.data;
}
