import { axiosInstance } from "./api.js";

export const trending = async () => {
    const response = await axiosInstance.get('/trending');
    return response.data;
};

export const carouselPosters = async () => {
    const response = await axiosInstance.get('/posters');
    return response.data;
};

export const topCreators = async () => {
    const response = await axiosInstance.get('/top-creators');
    return response.data;
};