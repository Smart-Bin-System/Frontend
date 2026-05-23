import axiosClient from "@/lib/axios";

export async function completeTask(taskId) {
  const response = await axiosClient.post(`/tasks/${taskId}/complete`);
  return response.data;
}
