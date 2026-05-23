import { axiosInstance } from "./api.js";

export const upcomingMovies = async () => {
  const response = await axiosInstance.get("/movie/upcoming");
  return response.data.data;
};

export const trendingMovies = async () => {
  const response = await axiosInstance.get("/trending/movies");
  return response.data.data;
};

export const topRatedMovies = async () => {
  const response = await axiosInstance.get("/movie/top-rated");
  return response.data.data;
};
