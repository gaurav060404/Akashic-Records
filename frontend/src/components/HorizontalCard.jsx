import { useNavigate } from 'react-router-dom';
import { FaStar, FaCalendarAlt, FaClock, FaUsers, FaTv, FaFilm } from 'react-icons/fa';

export default function HorizontalCard({ id, rank, compName, item, isAnime, isUpcoming }) {
  const navigate = useNavigate();

  const formatPopularity = (popularity) => {
    if (!popularity) return "N/A";
    let short = popularity.toString().slice(0, 3);
    return short.endsWith(".") ? short.slice(0, 2) : short;
  };

  const truncateText = (text, maxLength = isAnime ? 300 : 600) => {
    if (!text) return "No overview available.";
    if (text.length <= maxLength) return text;

    const truncated = text.slice(0, maxLength);
    const lastSpace = truncated.lastIndexOf(" ");
    return truncated.slice(0, lastSpace) + "...";
  };

  const formatRating = (rating) =>
    typeof rating === "number" ? rating.toFixed(1) : (rating || "N/A");

  const formatRuntime = (runtime) => {
    if (!runtime) return "N/A";
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const posterTitle = item.title || item.posterName || "Untitled";
  const imgSrc = isAnime
    ? item.posterPath
    : `https://image.tmdb.org/t/p/w220_and_h330_face${item.posterPath}`;

  const handleOnClick = () => {
    const encodedPosterName = encodeURIComponent(posterTitle);

    navigate(`/${compName.toLowerCase()}/rated/${id}/${encodedPosterName}`, {
      state: {
        poster: {
          id: item.id,
          posterName: item.posterName,
          posterPath: item.posterPath,
          backDropPath: item.backDropPath,
          title: compName,
          overview: item.overview,
          director: Array.isArray(item.director) ? item.director[0]?.name : item.director,
          genres: item.genres,
          rating: item.rating,
          seasons: item.seasons,
          runtime: item.runtime,
          releaseDate: item.releaseDate,
          popularity: item.popularity,
          trailer: item.trailerUrl,
          credits:item.casts,
          users: item.users,
          isUpcoming,
          isAnime,
        },
      },
    });
  };

  return (
    <div
      className="group relative bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 
                 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 ease-out
                 border border-gray-200 dark:border-gray-700
                 transform hover:-translate-y-2 hover:scale-[1.02] cursor-pointer overflow-hidden"
      style={{ width: "90%", minHeight: "280px" }}
      onClick={handleOnClick}
    >
      {/* Rank Badge */}
      <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-orange-500 to-red-500 
                      text-white font-bold text-lg px-3 py-1 rounded-full shadow-lg
                      transform group-hover:scale-110 transition-transform duration-300">
        #{rank}
      </div>

      {/* Content Container */}
      <div className="flex items-center gap-6 p-6 h-full">
        {/* Poster Image */}
        <div className="relative flex-shrink-0 w-44 h-64 rounded-xl overflow-hidden shadow-xl
                        transform group-hover:scale-105 transition-transform duration-500">
          <img src={imgSrc} alt={posterTitle} className="object-cover w-full h-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent 
                          opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Type Icon */}
          <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm rounded-full p-2">
            {compName === "Movies" ? (
              <FaFilm className="text-white text-sm" />
            ) : (
              <FaTv className="text-white text-sm" />
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-between h-64 py-2">
          {/* Title & Overview */}
          <div>
            <h2 className="text-gray-900 dark:text-white text-2xl font-bold mb-3 
                           group-hover:text-orange-600 dark:group-hover:text-orange-400 
                           transition-colors duration-300 leading-tight">
              {posterTitle}
            </h2>

            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-3 w-11/12">
              {truncateText(item.overview)}
            </p>
          </div>

          {/* Genres */}
          <div className="mb-4 flex flex-wrap gap-2">
            {(isAnime ? item.genres?.slice(0, 3) : item.genres?.slice(0, 2))?.map((genre, idx) => (
              <span
                key={idx}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs 
                           px-3 py-1 rounded-full font-medium shadow-sm"
              >
                {(isAnime ? genre : genre?.name)?.split("&")[0].trim()}
              </span>
            ))}
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3 text-sm mb-2">
            {/* Language */}
            {item.languages?.[0]?.english_name && (
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <span className="font-medium">Language:</span>
                <span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-md text-xs">
                  {item.languages[0].english_name}
                </span>
              </div>
            )}

            {/* Release Date */}
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <FaCalendarAlt className="text-orange-500" />
              <span className="text-xs">{item.releaseDate || "TBA"}</span>
            </div>

            {/* Runtime or Seasons */}
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <FaClock className="text-orange-500" />
              <span className="text-xs">
                {compName === "Movies"
                  ? formatRuntime(item.runtime)
                  : `${item.seasons || 1} ${item.seasons > 1 ? "Seasons" : "Season"}`}
              </span>
            </div>

            {/* Popularity */}
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <FaUsers className="text-orange-500" />
              <span className="text-xs">{formatPopularity(item.popularity)}k</span>
            </div>
          </div>
        </div>

        {/* Rating Section */}
        <div className="flex-shrink-0 flex flex-col items-center justify-center 
                        bg-gradient-to-br from-yellow-400 to-orange-500 
                        rounded-2xl p-6 text-white shadow-lg min-w-[120px] h-32
                        transform group-hover:scale-105 transition-all duration-300 mr-16">
          <FaStar className="text-white text-lg mb-2" />
          <div className="text-3xl font-bold mb-1">{formatRating(item.rating)}</div>
          <div className="text-xs opacity-90 text-center">
            {item.users ? `${item.users} votes` : "No votes"}
          </div>
        </div>
      </div>
    </div>
  );
}
