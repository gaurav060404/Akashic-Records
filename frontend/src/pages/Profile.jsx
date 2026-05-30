import { useState, useEffect } from "react";
import { fetchWatchlist } from "../services/watchlistService";
import { toggleWatchlistItem } from "../services/watchlistService";
import { getAllRatingsOfUser, deleteRating } from "../services/ratingService";
import { toast } from "react-hot-toast";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Profile() {
  const [watchlist, setWatchlist] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [filter, setFilter] = useState("all");
  const [ratingsFilter, setRatingsFilter] = useState("all");
  const [user, setUser] = useState({ name: "User", avatar: "https://i.pravatar.cc/150?img=11" });
  const [loading, setLoading] = useState(false);
  const [ratingsLoading, setRatingsLoading] = useState(false);

  // Get user data including avatar on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser({
          name: userData.name || "User",
          avatar: userData.avatar ||
            userData.picture ||
            (userData.googleUser?.picture) ||
            "https://i.pravatar.cc/150?img=11"
        });
      } catch (error) {
        console.error("Failed to parse user data:", error);
      }
    }
  }, []);

  // Fetch watchlist from backend on component mount
  useEffect(() => {
    const syncWatchlist = async () => {
      try {
        setLoading(true);
        const result = await fetchWatchlist();
        // Support several possible response shapes from the backend/service
        // result may be: { watchlist: [...] } or an array directly or { data: [...] }
        const list = result?.watchlist ?? result?.data ?? result;
        setWatchlist(Array.isArray(list) ? list : []);
      } catch (error) {
        console.error("Error syncing watchlist:", error);
      } finally {
        setLoading(false);
      }
    };

    syncWatchlist();
  }, []);

  useEffect(() => {
    const syncRatings = async () => {
      try {
        setRatingsLoading(true);
        const result = await getAllRatingsOfUser();

        const list =
          result?.ratings ??
          result?.reviews ??
          result?.items ??
          result?.docs ??
          result?.results ??
          result?.data ??
          result;

        setRatings(Array.isArray(list) ? list : []);
      } catch (error) {
        console.error("Error syncing ratings:", error);
      } finally {
        setRatingsLoading(false);
      }
    };

    syncRatings();
  }, []);

  // Lightweight type getter that uses `item.type` (or `media_type`) as source of truth
  const getType = (item) => String(item?.type ?? item?.media_type ?? "").toLowerCase();

  const getRatingType = (item) => String(item?.mediaType ?? item?.media_type ?? item?.type ?? item?.media?.type ?? "").toLowerCase();

  const getRatingId = (item) => item?.mediaId ?? item?.media_id ?? item?.id ?? item?._id ?? item?.media?.id ?? item?.media?._id ?? item?.tmdbId ?? item?.mal_id;

  const getRatingTitle = (item) => item?.media?.title ?? item?.media?.name ?? item?.title ?? item?.name ?? item?.mediaName ?? item?.posterName ?? "Untitled";

  const getRatingPoster = (item) => {
    const posterPath =
      item?.media?.posterPath ??
      item?.media?.poster_path ??
      item?.posterPath ??
      item?.poster_path ??
      item?.poster ??
      item?.image ??
      item?.thumbnail ??
      "";

    if (!posterPath) return "/popcorn.png";

    return posterPath;
  };

  const getRatingValue = (item) => Number(item?.rating ?? item?.value ?? item?.score ?? item?.userRating ?? 0);

  const getRatingReview = (item) => item?.review ?? item?.comment ?? item?.text ?? "No review provided.";

  const getRatingDate = (item) => item?.createdAt ?? item?.updatedAt ?? item?.date ?? null;

  // Count items by type using `type` field
  const counts = {
    movies: (watchlist || []).filter(item => getType(item).includes("movie")).length,
    series: (watchlist || []).filter(item => getType(item).includes("series") || getType(item).includes("tv")).length,
    anime: (watchlist || []).filter(item => getType(item).includes("anime")).length,
    manga: (watchlist || []).filter(item => getType(item).includes("manga")).length
  };

  // Filter items by category
  const filteredItems = (watchlist || []).filter(item => {
    if (filter === "all") return true;
    return getType(item).includes(filter.toLowerCase());
  });

  const filteredRatings = (ratings || []).filter((item) => {
    if (ratingsFilter === "all") return true;
    return getRatingType(item).includes(ratingsFilter.toLowerCase());
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

  const ratingCounts = {
    total: (ratings || []).length,
    movies: (ratings || []).filter(item => getRatingType(item).includes("movie")).length,
    series: (ratings || []).filter(item => getRatingType(item).includes("series") || getRatingType(item).includes("tv")).length,
    anime: (ratings || []).filter(item => getRatingType(item).includes("anime")).length,
    manga: (ratings || []).filter(item => getRatingType(item).includes("manga")).length,
  };

  // Remove from watchlist with backend sync
  const removeFromWatchlist = async (item) => {
    try {
      // Store item ID before removing (support multiple id shapes)
      const itemId = item.id ?? item._id ?? item.tmdbId ?? item.mal_id;

      // Helper to check id equality across different fields
      const matchesId = (w) => {
        const wid = w?.id ?? w?._id ?? w?.tmdbId ?? w?.mal_id;
        return String(wid) === String(itemId);
      };

      // Optimistically update UI immediately
      const previousWatchlist = [...watchlist];
      setWatchlist(watchlist.filter(w => !matchesId(w)));

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

  // Remove rating with backend sync
  const removeRating = async (ratingItem) => {
    try {
      const ratingId = getRatingId(ratingItem);
      const ratingType = getRatingType(ratingItem);

      const previous = [...ratings];
      setRatings(previous.filter(r => String(getRatingId(r)) !== String(ratingId)));

      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to delete ratings");
        setRatings(previous);
        return;
      }

      await deleteRating(ratingType, ratingId);
      toast.success("Rating removed");
    } catch (error) {
      console.error("Failed to delete rating:", error);
      toast.error("Failed to delete rating");
      // restore
      try {
        const refreshed = await getAllRatingsOfUser();
        const list =
          refreshed?.ratings ??
          refreshed?.reviews ??
          refreshed?.items ??
          refreshed?.docs ??
          refreshed?.results ??
          refreshed?.data ??
          refreshed;

        setRatings(Array.isArray(list) ? list : []);
      } catch (refreshErr) {
        console.error(refreshErr);
      }
    }
  };

  return (

    <div className="min-h-screen bg-[#050714] text-white">
      <Navbar isHomePage={false} hasBg={true} />

      {/* Loading spinner */}
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

      {/* User profile header */}
      {!loading && <div className="w-full bg-gradient-to-r from-[#0a1535] to-[#1e1040] pt-20 pb-8">
        <div className="max-w-6xl mx-auto px-4 flex items-center">
          <div className="w-40 h-40 rounded-full overflow-hidden border-2 border-white/20 shadow-lg mr-8">
            <img
              src={user.avatar}
              alt="User profile"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://i.pravatar.cc/150?img=11";
              }}
            />
          </div>

          <div className="flex flex-col justify-center pt-4">
            <h1 className="text-3xl font-custom4 font-bold mb-1">Welcome, {user.name}</h1>
            <p className="text-gray-300 text-sm mb-6 mt-2 ml-1">Manage your watchlist</p>

            {/* Stats */}
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
              <div className="flex flex-col items-center">
                <div className="text-4xl font-bold text-pink-400">
                  {counts.manga}
                </div>
                <div className="text-sm text-gray-400">Manga</div>
              </div>
            </div>
          </div>
        </div>
      </div>}

      {/* Content Section */}
      {!loading && <div className="max-w-6xl mx-auto py-12 px-4">
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
            <button
              onClick={() => setFilter("manga")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${filter === "manga"
                ? "bg-blue-600 text-white"
                : "bg-[#1a1b29] hover:bg-[#25263c] text-gray-300"
                }`}
            >
              Manga
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
                e.target.src = "/popcorn.png";
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
            {filteredItems.map((item, idx) => {
              const itemType = getType(item);
              const itemId = item.id ?? item._id ?? item.tmdbId ?? item.mal_id ?? idx;
              const posterPath = item.posterPath ?? item.poster_path ?? item.poster ?? item.image ?? item.thumbnail ?? "";

              const posterSrc = posterPath
                ? posterPath.startsWith("http")
                  ? posterPath
                  : item.isAnime
                    ? posterPath
                    : `https://image.tmdb.org/t/p/w500${posterPath}`
                : "/popcorn.png";

              return (
                <motion.div
                  key={itemId}
                  className="bg-[#1a1b29] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group border border-[#252636]"
                  variants={item}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <div className="relative">
                    <img
                      src={posterSrc}
                      alt={item.posterName || item.title || "Poster"}
                      className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-100"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/popcorn.png";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <Link
                        to={`/details/${itemType}/${itemId}`}
                        state={{ poster: item }}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm font-medium transition-all"
                      >
                        View Details
                      </Link>
                    </div>

                    {/* Rating Badge */}
                    <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-yellow-400 px-2 py-1 rounded-md text-sm font-bold flex items-center gap-1">
                      <span>★</span>
                      <span>{(Number(item.rating) || 0).toFixed(1)}</span>
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
                            itemType.includes("anime") ? "Anime" : "Manga"}
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
                      {item.name || item.title}
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

        {/* Ratings & Reviews */}
        <div className="mt-16">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <div>
              <h2 className="text-4xl font-bold">My Ratings / Reviews</h2>
              <p className="text-gray-400 text-sm mt-2">Everything you have rated, along with the notes you wrote.</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setRatingsFilter("all")}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${ratingsFilter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-[#1a1b29] hover:bg-[#25263c] text-gray-300"
                  }`}
              >
                All
              </button>
              <button
                onClick={() => setRatingsFilter("movie")}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${ratingsFilter === "movie"
                  ? "bg-blue-600 text-white"
                  : "bg-[#1a1b29] hover:bg-[#25263c] text-gray-300"
                  }`}
              >
                Movies
              </button>
              <button
                onClick={() => setRatingsFilter("series")}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${ratingsFilter === "series"
                  ? "bg-blue-600 text-white"
                  : "bg-[#1a1b29] hover:bg-[#25263c] text-gray-300"
                  }`}
              >
                Series
              </button>
              <button
                onClick={() => setRatingsFilter("anime")}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${ratingsFilter === "anime"
                  ? "bg-blue-600 text-white"
                  : "bg-[#1a1b29] hover:bg-[#25263c] text-gray-300"
                  }`}
              >
                Anime
              </button>
              <button
                onClick={() => setRatingsFilter("manga")}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${ratingsFilter === "manga"
                  ? "bg-blue-600 text-white"
                  : "bg-[#1a1b29] hover:bg-[#25263c] text-gray-300"
                  }`}
              >
                Manga
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-[#1a1b29] border border-[#252636] rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-blue-400">{ratingCounts.total}</div>
              <div className="text-sm text-gray-400 mt-1">Total</div>
            </div>
            <div className="bg-[#1a1b29] border border-[#252636] rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-purple-400">{ratingCounts.movies}</div>
              <div className="text-sm text-gray-400 mt-1">Movies</div>
            </div>
            <div className="bg-[#1a1b29] border border-[#252636] rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-pink-400">{ratingCounts.series}</div>
              <div className="text-sm text-gray-400 mt-1">Series</div>
            </div>
            <div className="bg-[#1a1b29] border border-[#252636] rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-green-400">{ratingCounts.anime}</div>
              <div className="text-sm text-gray-400 mt-1">Anime</div>
            </div>
            <div className="bg-[#1a1b29] border border-[#252636] rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-pink-400">{ratingCounts.manga}</div>
              <div className="text-sm text-gray-400 mt-1">Manga</div>
            </div>
          </div>

          {ratingsLoading ? (
            <div className="py-16 text-center text-gray-400">Loading your ratings and reviews...</div>
          ) : ratings.length === 0 ? (
            <div className="py-12 text-center bg-[#0f1120] border border-[#252636] rounded-2xl">
              <p className="text-gray-400 text-xl mb-3">You have not rated anything yet</p>
              <p className="text-gray-500 text-sm">Open a title and submit a rating or review to see it here.</p>
            </div>
          ) : filteredRatings.length === 0 ? (
            <p className="text-gray-400 text-center py-10">No ratings match the selected filter</p>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {filteredRatings.map((rating, idx) => {
                const ratingId = getRatingId(rating) ?? idx;
                const ratingType = getRatingType(rating);
                const detailsPath = ratingType && ratingId ? `/details/${ratingType}/${ratingId}` : null;
                const reviewDate = getRatingDate(rating);
                const posterSrc = getRatingPoster(rating);
                const ratingValue = getRatingValue(rating);

                return (
                  <motion.div
                    key={ratingId}
                    className="bg-[#1a1b29] rounded-xl overflow-hidden shadow-lg border border-[#252636]"
                    variants={item}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    <div className="relative">
                      <img
                        src={rating.mediaType === "anime" || rating.mediaType === "manga" ? posterSrc : `https://image.tmdb.org/t/p/w500${posterSrc}`}
                        alt={getRatingTitle(rating)}
                        className="w-full h-56 object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/popcorn.png";
                        }}
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />

                      <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-sm text-yellow-400 px-2 py-1 rounded-md text-sm font-bold flex items-center gap-1">
                        <span>★</span>
                        <span>{ratingValue.toFixed(1)}</span>
                      </div>

                      <div className="absolute top-3 right-3">
                        <div className={`${ratingType.includes("movie") ? "bg-purple-600/90" :
                          ratingType.includes("series") || ratingType.includes("tv") ? "bg-pink-600/90" :
                            ratingType.includes("anime") ? "bg-green-600/90" :
                              "bg-gray-600/90"
                          } text-xs text-white px-2 py-1 rounded-md font-medium`}>
                          {ratingType.includes("movie") ? "Movie" :
                            ratingType.includes("series") || ratingType.includes("tv") ? "Series" :
                              ratingType.includes("anime") ? "Anime" : "Manga"}
                        </div>
                      </div>

                      {detailsPath ? (
                        <Link
                          to={detailsPath}
                          state={{ poster: rating }}
                          className="absolute bottom-3 left-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm font-medium transition-all"
                        >
                          View Details
                        </Link>
                      ) : null}
                      <button
                        onClick={() => removeRating(rating)}
                        className="absolute bottom-3 right-3 bg-red-600/80 hover:bg-red-700 text-white p-2 rounded-full transition-opacity"
                        aria-label="Delete rating"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>

                    <div className="p-4">
                      <div>
                        <h3 className="font-bold text-lg text-white truncate">
                          {getRatingTitle(rating)}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 uppercase tracking-[0.24em]">
                          {reviewDate ? new Date(reviewDate).toLocaleDateString() : "Recently"}
                        </p>
                      </div>

                      <p className="text-gray-300 text-sm leading-relaxed line-clamp-4 min-h-[5.5rem]">
                        {getRatingReview(rating)}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </div>}
    </div>
  );
}