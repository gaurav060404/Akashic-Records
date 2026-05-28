import axios from "axios";

export const searchMedia = async (query, type = "all") => {
  const response = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/tmdb/search`,
    {
      params: {
        q: query,
        type,
      },
    },
  );

  return response.data.data;
};
