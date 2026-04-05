import axiosClient from "@/lib/axios";
import { ROLES } from "@/constants/roles";

export async function createUser(payload) {
  const endpoint = payload.role === ROLES.ADMIN ? "/users/createAdmin" : "/users/createWorker";
  
  const requestPayload = {
    name: payload.name,
    email: payload.email,
    phone: payload.phone || "",
    nic: payload.nic || "",
  };

  if (payload.role === ROLES.WORKER && payload.shift) {
    requestPayload.shift = payload.shift;
  }

  const response = await axiosClient.post(endpoint, requestPayload);
  return response.data;
}
