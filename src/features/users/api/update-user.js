import axiosClient from "@/lib/axios";
import { ROLES } from "@/constants/roles";

export async function updateUser(userId, payload) {
  const requestPayload = {
    name: payload.name,
    email: payload.email,
    workerProfile: {
      phone: payload.phone || "",
      nic: payload.nic || "",
      shift: payload.role === ROLES.WORKER ? payload.shift || "" : "",
    },
  };

  if (payload.role === ROLES.WORKER && payload.shift) {
    requestPayload.shift = payload.shift;
  }

  const response = await axiosClient.put(`/users/${userId}`, requestPayload);
  return response.data;
}
