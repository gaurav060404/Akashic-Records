import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function Details() {
  const location = useLocation();
  const poster = location.state?.poster || null;
  const [showFullOverview, setShowFullOverview] = useState(false);

  console.log(poster);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!poster) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Data Available</h2>
          <p className="text-gray-400">Please navigate here from a movie card.</p>
        </div>
      </div>
    );
  }

  function truncateToThreeLines(text) {
    if (!text) return "";
    const maxLength = 300;
    if (text.length <= maxLength) return text;
    const truncated = text.slice(0, maxLength);
    const lastPeriodIndex = truncated.lastIndexOf(".");
    return lastPeriodIndex !== -1
      ? truncated.slice(0, lastPeriodIndex + 1)
      : truncated + "...";
  }

  const handleUrl = (url) => {
    if (url) {
      window.open(url, "_blank");
    }
  }

  const formatRating = (rating) => {
    if (!rating) return "N/A";
    return typeof rating === 'number' ? rating.toFixed(1) : rating.toString().slice(0, 3);
  };

  const formatRuntime = (runtime) => {
    if (!runtime || runtime == "N/A") return "TBA";
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const seasonOrSeasons = (value) => {
    if (!value) return "TBA";
    if (value > 1) return "Seasons";
    return "Season";
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <div className="relative z-50">
        <Navbar isHomePage={false} hasBg={true} />
      </div>

      {/* Hero Section with Backdrop */}
      <div className="relative">
        {/* Backdrop Image */}
        <div className="h-[60vh] sm:h-[70vh] lg:h-[80vh] w-full overflow-hidden">
          <img
            src={
              poster.isAnime
                ? poster.backDropPath
                : `https://image.tmdb.org/t/p/original${poster?.backDropPath}`
            }
            alt={poster.posterName || poster.title}
            className="object-cover w-full h-full transition-transform duration-700 hover:scale-105"
          />
          {/* Gradients for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/40"></div>
        </div>

        {/* Main Content Overlay */}
        <div className="absolute inset-0 flex h-[100vh] items-end">
          <div className="w-full px-4 sm:px-8 lg:px-16 pb-8 lg:pb-16">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 items-end">

                {/* Poster */}
                <div className="flex-shrink-0 w-48 sm:w-56 lg:w-72">
                  <div className="aspect-[2/3] overflow-hidden rounded-xl shadow-2xl border-2 border-white/20">
                    <img
                      src={
                        poster.isAnime
                          ? poster.posterPath
                          : `https://image.tmdb.org/t/p/w500${poster.posterPath}`
                      }
                      alt={poster.posterName || poster.title}
                      className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="text-gray-300 text-center pt-5 font-custom4">{poster.director || "Unknown"}</div>
                </div>

                {/* Movie Info */}
                <div className="flex-1 space-y-4 lg:space-y-6">
                  {/* Title */}
                  <div>
                    <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-2 leading-tight">
                      {poster.posterName || poster.title}
                    </h1>
                  </div>

                  {/* Rating and Quick Stats */}
                  <div className="flex flex-wrap items-center gap-4 lg:gap-6">
                    {/* Rating */}
                    <div className="flex items-center gap-2 bg-yellow-500/20 backdrop-blur-sm rounded-lg px-3 py-2 border border-yellow-500/30">
                      <span className="text-yellow-400 text-lg">★</span>
                      <span className="text-xl font-bold text-yellow-400">
                        {formatRating(poster.rating)}
                      </span>
                    </div>

                    {/* Runtime */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
                      {poster.seasons ? <span className="text-sm font-medium">{poster.seasons}  {seasonOrSeasons(poster.seasons)}</span> :
                        <span className="text-sm font-medium">{formatRuntime(poster.runtime)}</span>
                      }
                    </div>

                    {/* Release Year */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
                      <span className="text-sm font-medium">
                        {poster.releaseDate != "null-null-null" ? new Date(poster.releaseDate).getFullYear() : "TBA"}
                      </span>
                    </div>
                  </div>

                  {/* Genres */}
                  {poster.genres && poster.genres.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {poster.genres.slice(0, 4).map((genre, i) => (
                        <span
                          key={i}
                          className="bg-blue-600/20 backdrop-blur-sm border border-blue-500/30 text-blue-200 text-sm px-3 py-1 rounded-full"
                        >
                          {genre?.name?.split("&")[0].trim() || genre}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Overview */}
                  <div className="max-w-3xl">
                    <p className="text-gray-200 leading-relaxed text-base lg:text-lg">
                      {showFullOverview ? poster.overview : truncateToThreeLines(poster.overview)}
                    </p>
                    {poster.overview && poster.overview.length > 300 && (
                      <button
                        onClick={() => setShowFullOverview(!showFullOverview)}
                        className="mt-2 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                      >
                        {showFullOverview ? "Show Less" : "Read More"}
                      </button>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <button onClick={() => handleUrl(poster.trailer)} className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2">
                      <span>▶</span>
                      Watch Trailer
                    </button>
                    <button className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 flex items-center gap-2">
                      <span>+</span>
                      Add to Watchlist
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Information Section */}
      <div className="bg-gradient-to-b from-black to-gray-900 py-12 lg:py-16 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center">
              <div className="text-xs text-gray-400 mb-2">Popularity</div>
              <div className="font-bold text-lg">{poster.popularity?.toString().slice(0, 5) || "N/A"}</div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center">
              <div className="text-xs text-gray-400 mb-2">Users</div>
              <div className="font-bold text-lg">{poster.users || "N/A"}</div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center">
              <div className="text-xs text-gray-400 mb-2">Release Date</div>
              <div className="font-bold text-sm">{poster.releaseDate != "null-null-null" ? poster.releaseDate : "TBA"}</div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center">
              <div className="text-xs text-gray-400 mb-2">Type</div>
              <div className="font-bold text-sm">
                {poster.title === "movies" || poster.title === "Movies" || poster.type === "Movie"
                  ? "Movie"
                  : poster.title === "Series" || poster.title === "series" || poster.type === "Series"
                    ? "Series"
                    : "Anime"}
              </div>
            </div>
          </div>
          {/* Cast Section */}
          {poster.credits && poster.credits.length > 0 && (
            <div className="max-w-7xl mx-auto mt-5">
              <h2 className="text-2xl font-bold mb-6">Cast</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-6 gap-6">
                {poster.credits.map((cast, index) => (
                  <div
                    key={index}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden shadow-md 
                     hover:shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    <div className="aspect-[2/3] w-full overflow-hidden">
                      <img
                        src={
                          poster?.isAnime || poster?.title === "Anime" || poster?.type === "Anime"
                            ? cast.image || cast.profile_path || "https://via.placeholder.com/300x450?text=No+Image"
                            : cast.profile_path || cast.profilePath
                              ? `https://image.tmdb.org/t/p/w300${cast.profile_path || cast.profilePath}`
                              : "https://via.placeholder.com/300x450?text=No+Image"
                        }
                        alt={cast.name || "No Image"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3 text-center">
                      <p className="text-white font-semibold text-sm truncate">{poster.isAnime ? cast.actor : cast.name}</p>
                      <p className="text-gray-400 text-xs truncate">{poster.isAnime ? cast.character : cast.character}</p>
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
