import axiosClient from "@/lib/axios";

export async function getUsers() {
  const response = await axiosClient.get("/users");
  return response.data;
}
