import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;

// Get user's watchlist
export const fetchWatchlist = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return { watchlist: [] };

    const response = await axios.get(`${API_URL}/watchlist`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error("Error fetching watchlist:", error);
    return { watchlist: [] };
  }
};

// Toggle item in watchlist (add or remove)
export const toggleWatchlistItem = async (item) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not authenticated");

    const response = await axios.post(
      `${API_URL}/watchlist/toggle`,
      item,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error("Error updating watchlist:", error);
    throw error;
  }
};