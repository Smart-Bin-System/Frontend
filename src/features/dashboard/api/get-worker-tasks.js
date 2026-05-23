import axiosClient from "@/lib/axios";

export async function getWorkerTasks() {
  const response = await axiosClient.get("/tasks/my-tasks");
  return response.data;
}
