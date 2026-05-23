import { axiosInstance } from "./api.js";

export const recommendedMangas = async () => {
    const response = await axiosInstance.get('/manga/recommended');
    return response.data;
};

export const trendingMangas = async () => {
    const response = await axiosInstance.get('/trending/mangas');
    return response.data;
};

export const topRatedMangas = async () => {
    const response = await axiosInstance.get('/manga/top-rated');
    return response.data;
};