import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}`,
  withCredentials: true,
});

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
};

export const submitRating = async ({
  mediaId,
  mediaType,
  title = "",
  poster = "",
  rating,
  review = "",
}) => {
  const response = await axiosInstance.post(
    "/rating",
    {
      mediaId,
      mediaType,
      title,
      poster,
      rating,
      review,
    },
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data.data;
};

export const getUserRating = async (mediaType, mediaId) => {
  const response = await axiosInstance.get(
    `/rating/user/${mediaType}/${mediaId}`,
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data.data;
};

export const getRatingStats = async (mediaType, mediaId) => {
  const response = await axiosInstance.get(
    `/rating/stats/${mediaType}/${mediaId}`,
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data.data;
};

export const getAllRatingsOfUser = async () => {
  const response = await axiosInstance.get(`/rating`, {
    headers: getAuthHeaders(),
  });

  return response.data.data;
};
