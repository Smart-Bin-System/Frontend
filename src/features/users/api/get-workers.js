import axiosClient from "@/lib/axios";

export async function getWorkers() {
  const response = await axiosClient.get("/users/workers");
  return response.data;
}
