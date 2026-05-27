import { axiosInstance, axiosInstance2 } from "./api.js";

export const getDetails = async (type, id) => {
  const response = await axiosInstance2.get(`/${type}/${id}`);
  return response.data.data;
};
