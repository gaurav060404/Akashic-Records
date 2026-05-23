import { axiosInstance } from "./api.js";

export const upcomingSeries = async () => {
    const response = await axiosInstance.get('/series/upcoming');
    return response.data;
};

export const trendingSeries = async () => {
    const response = await axiosInstance.get('/trending/series');
    return response.data;
};

export const topRatedMovies = async () => {
    const response = await axiosInstance.get('/series/top-rated');
    return response.data;
};