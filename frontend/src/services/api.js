import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/tmdb`,
  withCredentials: true,
});

const axiosInstance2 = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/details`,
  withCredentials: true,
});

export { axiosInstance, axiosInstance2 };
