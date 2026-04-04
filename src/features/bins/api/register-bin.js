import axiosClient from "@/lib/axios";

export const registerBin = async (payload) => {
  const { data } = await axiosClient.post("/bins/register", payload);
  return data;
};
