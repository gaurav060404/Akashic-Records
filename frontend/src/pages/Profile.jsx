import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { watchlistState } from "../store/store.jsx";
import { fetchWatchlist } from "../services/watchlistService";
import { toggleWatchlistItem } from "../services/watchlistService";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Profile() {
  const [watchlist, setWatchlist] = useRecoilState(watchlistState);
  const [filter, setFilter] = useState("all");
  const [user, setUser] = useState({ name: "User", avatar: "https://i.pravatar.cc/150?img=11" });
  const [loading, setLoading] = useState(false);

  // Fetch watchlist from backend on component mount
  useEffect(() => {
    const syncWatchlist = async () => {
      try {
        setLoading(true);
        const result = await fetchWatchlist();
        if (result.watchlist) {
          setWatchlist(result.watchlist);
        }
      } catch (error) {
        console.error("Error syncing watchlist:", error);
      } finally {
        setLoading(false);
      }
    };

    syncWatchlist();
  }, []);

  // Helper function to determine item type
  const getItemType = (item) => {
    // First check explicit type property
    if (item.type) {
      return item.type.toLowerCase();
    }
    // Then check media_type property (commonly used in API responses)
    else if (item.media_type) {
      return item.media_type.toLowerCase();
    }
    // Then check title or name properties for clues
    else if (item.posterName?.toLowerCase().includes("anime") ||
      item.title?.toLowerCase().includes("anime") ||
      item.isAnime) {
      return "anime";
    }
    else if (item.posterName?.toLowerCase().includes("movie") ||
      item.title?.toLowerCase() === "movies" ||
      item.title?.toLowerCase().includes("movie")) {
      return "movie";
    }
    else if (item.posterName?.toLowerCase().includes("series") ||
      item.title?.toLowerCase() === "series" ||
      item.title?.toLowerCase().includes("tv")) {
      return "series";
    }
    // Default fallback
    return "unknown";
  };

  // Count items by type
  const counts = {
    movies: watchlist.filter(item => getItemType(item).includes("movie")).length,
    series: watchlist.filter(item => getItemType(item).includes("series") || getItemType(item).includes("tv")).length,
    anime: watchlist.filter(item => getItemType(item).includes("anime")).length
  };

  // Filter items by category
  const filteredItems = watchlist.filter(item => {
    if (filter === "all") return true;
    return getItemType(item).includes(filter.toLowerCase());
  });

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  // Remove from watchlist with backend sync
  const removeFromWatchlist = async (item) => {
    try {
      // Store item ID before removing
      const itemId = item.id;
      
      // Optimistically update UI immediately
      const previousWatchlist = [...watchlist];
      setWatchlist(watchlist.filter(w => w.id !== itemId));
      
      // Then sync with backend
      const token = localStorage.getItem("token");
      if (token) {
        try {
          await toggleWatchlistItem(item);
          // Backend sync successful, no need to do anything else
        } catch (error) {
          // If backend fails, restore previous state
          console.error("Failed to remove from watchlist on server:", error);
          setWatchlist(previousWatchlist);
          // Optionally show error toast here
        }
      }
    } catch (error) {
      console.error("Failed to remove from watchlist:", error);
    }
  };

  return (

    <div className="min-h-screen bg-[#050714] text-white">
      <Navbar isHomePage={false} hasBg={true} />

      {loading && (
        <div className="h-screen flex justify-center items-center bg-black">
          <button disabled type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center">
            <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
            </svg>
            Loading...
          </button>
        </div>
      )}

      <div className="w-full bg-gradient-to-r from-[#0a1535] to-[#1e1040] pt-20 pb-8">
        <div className="max-w-6xl mx-auto px-4 flex items-center">
          <div className="w-40 h-40 rounded-full overflow-hidden border-2 border-white/20 shadow-lg mr-8">
            <img
              src={user.avatar}
              alt="User profile"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col justify-center pt-4">
            <h1 className="text-3xl font-custom4 font-bold mb-1">Welcome, User</h1>
            <p className="text-gray-300 text-sm mb-6 mt-2 ml-1">Manage your watchlist</p>

            <div className="stats flex gap-12">
              <div className="flex flex-col items-center">
                <div className="text-4xl font-bold text-blue-400">{watchlist.length}</div>
                <div className="text-sm text-gray-400">Total</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-4xl font-bold text-purple-400">
                  {counts.movies}
                </div>
                <div className="text-sm text-gray-400">Movies</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-4xl font-bold text-pink-400">
                  {counts.series}
                </div>
                <div className="text-sm text-gray-400">Series</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-4xl font-bold text-green-400">
                  {counts.anime}
                </div>
                <div className="text-sm text-gray-400">Anime</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-4xl font-bold">My Watchlist</h2>

          {/* Filter Buttons */}
          <div className="flex">
            <button
              onClick={() => setFilter("all")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${filter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-[#1a1b29] hover:bg-[#25263c] text-gray-300"
                }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("movie")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all mx-2 ${filter === "movie"
                  ? "bg-blue-600 text-white"
                  : "bg-[#1a1b29] hover:bg-[#25263c] text-gray-300"
                }`}
            >
              Movies
            </button>
            <button
              onClick={() => setFilter("series")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all mx-2 ${filter === "series"
                  ? "bg-blue-600 text-white"
                  : "bg-[#1a1b29] hover:bg-[#25263c] text-gray-300"
                }`}
            >
              Series
            </button>
            <button
              onClick={() => setFilter("anime")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${filter === "anime"
                  ? "bg-blue-600 text-white"
                  : "bg-[#1a1b29] hover:bg-[#25263c] text-gray-300"
                }`}
            >
              Anime
            </button>
          </div>
        </div>

        {/* Watchlist Items */}
        {watchlist.length === 0 ? (
          <div className="py-3 text-center">
            <img
              src="/popcorn.png"
              alt="Popcorn"
              className="w-32 h-32 mx-auto mb-4"
              onError={(e) => {
                e.target.onerror = null;
                e.target.outerHTML = '<div class="text-9xl mb-4">🍿</div>';
              }}
            />
            <p className="text-gray-400 text-xl mb-6">Your watchlist is empty</p>
            <Link to="/" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-all">
              Browse Content
            </Link>
          </div>
        ) : filteredItems.length === 0 ? (
          <p className="text-gray-400 text-center py-10">No items match the selected filter</p>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {filteredItems.map((item) => {
              const itemType = getItemType(item);
              return (
                <motion.div
                  key={item.id}
                  className="bg-[#1a1b29] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group border border-[#252636]"
                  variants={item}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <div className="relative">
                    <img
                      src={
                        item.isAnime
                          ? item.posterPath
                          : `https://image.tmdb.org/t/p/w500${item.posterPath}`
                      }
                      alt={item.posterName || item.title}
                      className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <Link
                        to={`/details/${item.id}`}
                        state={{ poster: item }}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm font-medium transition-all"
                      >
                        View Details
                      </Link>
                    </div>

                    {/* Rating Badge */}
                    <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-yellow-400 px-2 py-1 rounded-md text-sm font-bold flex items-center gap-1">
                      <span>★</span>
                      <span>{(item.rating || 0).toFixed(1)}</span>
                    </div>

                    {/* Type Badge */}
                    <div className="absolute top-3 right-3">
                      <div className={`${itemType.includes("movie") ? "bg-purple-600/90" :
                          itemType.includes("series") || itemType.includes("tv") ? "bg-pink-600/90" :
                            itemType.includes("anime") ? "bg-green-600/90" :
                              "bg-gray-600/90"
                        } text-xs text-white px-2 py-1 rounded-md font-medium`}>
                        {itemType.includes("movie") ? "Movie" :
                          itemType.includes("series") || itemType.includes("tv") ? "Series" :
                            itemType.includes("anime") ? "Anime" : "Unknown"}
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromWatchlist(item)}
                      className="absolute bottom-3 right-3 bg-red-600/80 hover:bg-red-700 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Remove from watchlist"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>

                  <div className="p-3">
                    <h3 className="font-bold text-lg truncate text-white">
                      {item.posterName || item.title}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-2 mt-2 h-10">
                      {item.overview || "No description available"}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}