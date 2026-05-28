import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useQuery } from "@tanstack/react-query";
import { getDetails } from "../services/detailsService.js";
// import { toggleWatchlistItem } from "../services/watchlistService";
import { toast } from "react-hot-toast";
import { toggleWatchlistItem, fetchWatchlist } from "../services/watchlistService";

export default function Details() {
  const navigate = useNavigate();
  const { type, id } = useParams();
  const [showFullOverview, setShowFullOverview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  const {
    data: item,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["details", type, id],
    queryFn: () => getDetails(type, id),
    onSuccess: (data) => {
      // we'll determine watchlist membership separately after fetching watchlist
    },
  });

  // Determine if the loaded item is already in the user's watchlist
  useEffect(() => {
    const checkWatchlist = async () => {
      if (!item) return;
      try {
        const result = await fetchWatchlist();
        const list = result?.watchlist ?? result?.data ?? result ?? [];

        const computeId = (it) => (it?.id ?? it?._id ?? it?.tmdbId ?? it?.imdbId ?? it?.title ?? '').toString();
        const itemId = computeId(item);

        const found = Array.isArray(list) && list.some(i => computeId(i) === itemId);
        setIsInWatchlist(!!found);
      } catch (err) {
        console.error('Failed to fetch watchlist for details page', err);
      }
    };

    checkWatchlist();
  }, [item]);

  const handleWatchlistToggle = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      const result = await toggleWatchlistItem(item);

      // Expected shape: { action: 'added'|'removed', watchlist: [...] }
      const added = result?.action === 'added';
      setIsInWatchlist(added);

      toast.success(added ? 'Added to watchlist' : 'Removed from watchlist');
    } catch (error) {
      console.error('Watchlist toggle error', error);
      const msg = error?.message ?? 'Failed to update watchlist';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const truncateToThreeLines = (text) => {
    if (!text) return "";

    const maxLength = 300;

    if (text.length <= maxLength) return text;

    return text.slice(0, maxLength) + "...";
  };

  const handleUrl = (url) => {
    if (url) {
      window.open(url, "_blank");
    }
  };

  const formatRating = (rating) => {
    if (!rating) return "N/A";

    return typeof rating === "number"
      ? rating.toFixed(1)
      : rating.toString().slice(0, 3);
  };

  const formatRuntime = (runtime) => {
    if (!runtime || runtime === "N/A") return "TBA";

    if (typeof runtime === "string") return runtime;

    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;

    return hours > 0
      ? `${hours}h ${minutes}m`
      : `${minutes}m`;
  };

  const seasonOrSeasons = (value) => {
    if (!value) return "Season";

    return value > 1 ? "Seasons" : "Season";
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        Loading...
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        Failed to load details
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <div className="relative z-50">
        <Navbar isHomePage={false} hasBg={true} />
      </div>

      {/* Hero Section */}
      <div className="relative">
        {/* Backdrop */}
        <div className="h-[60vh] sm:h-[70vh] lg:h-[80vh] w-full overflow-hidden">
          <img
            src={(item.type === "anime" || item.type === "manga") ? item.poster : `https://image.tmdb.org/t/p/original${item.backdrop}`}
            alt={item.title}
            className="object-cover w-full h-full transition-transform duration-700 hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/40"></div>
        </div>

        {/* Overlay Content */}
        <div className="absolute inset-0 flex h-[100vh] items-end">
          <div className="w-full px-4 sm:px-8 lg:px-16 pb-8 lg:pb-16">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 items-end">

                {/* Poster */}
                <div className="flex-shrink-0 w-48 sm:w-56 lg:w-72">
                  <div className="aspect-[2/3] overflow-hidden rounded-xl shadow-2xl border-2 border-white/20">
                    <img
                      src={(item.type === "anime" || item.type === "manga") ? item.poster : `https://image.tmdb.org/t/p/w500${item.poster}`}
                      alt={item.title}
                      className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="text-gray-300 text-center pt-5 font-custom4">
                    {item.director || item.studio || "Unknown"}
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 space-y-4 lg:space-y-6">
                  {/* Title */}
                  <div>
                    <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-2 leading-tight">
                      {item.title}
                    </h1>
                  </div>

                  {/* Stats */}
                  <div className="flex flex-wrap items-center gap-4 lg:gap-6">

                    {/* Rating */}
                    <div className="flex items-center gap-2 bg-yellow-500/20 backdrop-blur-sm rounded-lg px-3 py-2 border border-yellow-500/30">
                      <span className="text-yellow-400 text-lg">★</span>

                      <span className="text-xl font-bold text-yellow-400">
                        {formatRating(item.rating)}
                      </span>
                    </div>

                    {/* Runtime / Seasons */}
                    {item.type !== "manga" ? <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
                      {item.seasons ? (
                        <span className="text-sm font-medium">
                          {item.seasons} {seasonOrSeasons(item.seasons)}
                        </span>
                      ) : item.type === "anime" ? (item.animeType == "Movie" ? "Movie" :
                        (item.episodes === null ?
                          <span className="text-sm font-medium">
                            {item.status}
                          </span>
                          :
                          <span className="text-sm font-medium">
                            {item.episodes} {item.episodes > 1 ? "Episodes" : "Episode"}
                          </span>)
                      ) : (
                        <span className="text-sm font-medium">
                          {formatRuntime(item.runtime)}
                        </span>
                      )}
                    </div> :
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
                        <span className="text-sm font-medium">
                          {item.status}
                        </span>
                      </div>
                    }

                    {/* Release Year */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
                      <span className="text-sm font-medium">
                        {item.releaseDate
                          ? new Date(item.releaseDate).getFullYear()
                          : "TBA"}
                      </span>
                    </div>
                  </div>

                  {/* Genres */}
                  {item.genres && item.genres.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {item.genres.slice(0, 4).map((genre, i) => (
                        <span
                          key={i}
                          className="bg-blue-600/20 backdrop-blur-sm border border-blue-500/30 text-blue-200 text-sm px-3 py-1 rounded-full"
                        >
                          {genre?.name || genre}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Overview */}
                  <div className="max-w-3xl">
                    <p className="text-gray-200 leading-relaxed text-base lg:text-lg">
                      {showFullOverview
                        ? item.overview
                        : truncateToThreeLines(item.overview)}
                    </p>

                    {item.overview?.length > 300 && (
                      <button
                        onClick={() =>
                          setShowFullOverview(!showFullOverview)
                        }
                        className="mt-2 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                      >
                        {showFullOverview
                          ? "Show Less"
                          : "Read More"}
                      </button>
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-wrap gap-3">

                    {/* Trailer */}
                    {item.trailer && (
                      <button
                        onClick={() => handleUrl(item.trailer)}
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
                      >
                        <span>▶</span>
                        Watch Trailer
                      </button>
                    )}

                    {/* Watchlist */}
                    <button
                      onClick={handleWatchlistToggle}
                      disabled={loading}
                      className={`${isInWatchlist
                        ? "bg-green-600/80 hover:bg-green-700 border-green-500/30"
                        : "bg-white/10 hover:bg-white/20 border-white/20"
                        } backdrop-blur-sm border text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 flex items-center gap-2`}
                    >
                      {loading ? (
                        <span className="inline-block w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                      ) : (
                        <span>
                          {isInWatchlist ? "✓" : "+"}
                        </span>
                      )}

                      {isInWatchlist
                        ? "Added to Watchlist"
                        : "Add to Watchlist"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Bottom Section */}
      <div className="bg-gradient-to-b from-black to-gray-900 py-12 lg:py-16 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center">
              <div className="text-xs text-gray-400 mb-2">
                Popularity
              </div>

              <div className="font-bold text-lg">
                {item.popularity
                  ? item.popularity.toString().slice(0, 5)
                  : "N/A"}
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center">
              <div className="text-xs text-gray-400 mb-2">
                Rating
              </div>

              <div className="font-bold text-lg">
                {formatRating(item.rating)}
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center">
              <div className="text-xs text-gray-400 mb-2">
                Release Date
              </div>

              <div className="font-bold text-sm">
                {item.releaseDate.length > 10 ? item.releaseDate.substring(0, 10) : item.releaseDate || "TBA"}
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center">
              <div className="text-xs text-gray-400 mb-2">
                Type
              </div>

              <div className="font-bold text-sm capitalize">
                {item.type === "manga" ? item.mangaType : item.type}
              </div>
            </div>
          </div>

          {/* Cast */}
          {item.credits && item.credits.length > 0 && (
            <div className="max-w-7xl mx-auto mt-5">
              <h2 className="text-2xl font-bold mb-6">
                Cast
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-6 gap-6">

                {item.credits.map((cast, index) => (
                  <div
                    key={index}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    <div className="aspect-[2/3] w-full overflow-hidden">
                      <img
                        src={
                          (item.type === "anime" || item.type === "manga") ? cast.image : `https://image.tmdb.org/t/p/original${cast.image}`
                        }
                        alt={cast.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="p-3 text-center">
                      <p className="text-white font-semibold text-sm truncate">
                        {cast.name}
                      </p>

                      <p className="text-gray-400 text-xs truncate">
                        {cast.character}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}