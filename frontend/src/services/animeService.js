import { axiosInstance } from "./api.js";

const upcomingAnimes = async () => {
    const response = await axiosInstance.get('/anime/upcoming');
    return response.data;
};

const trendingAnimes = async () => {
    const response = await axiosInstance.get('/trending/animes');
    return response.data;
};

const topRatedAnimes = async () => {
    const response = await axiosInstance.get('/anime/top-rated');
    return response.data;
};
