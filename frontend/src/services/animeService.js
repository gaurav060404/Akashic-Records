import { axiosInstance } from "./api.js";

export const upcomingAnimes = async () => {
  const response = await axiosInstance.get("/anime/upcoming");
  return response.data.data;
};

export const trendingAnimes = async () => {
  const response = await axiosInstance.get("/trending/animes");
  return response.data.data;
};

export const topRatedAnimes = async () => {
  const response = await axiosInstance.get("/anime/top-rated");
  return response.data.data;
};
