import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useQuery } from "@tanstack/react-query";
import { getDetails } from "../services/detailsService.js";
// import { toggleWatchlistItem } from "../services/watchlistService";
import { toast } from "react-hot-toast";
import { toggleWatchlistItem, fetchWatchlist } from "../services/watchlistService";
import { useRateMedia } from "../hooks/useRateMedia.js";
import { useRatingStats, useUserRating } from "../hooks/useRating.js";

export default function Details() {
  const navigate = useNavigate();
  const { type, id } = useParams();
  const token = localStorage.getItem("token");
  const [showFullOverview, setShowFullOverview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [ratingValue, setRatingValue] = useState(1);
  const [reviewText, setReviewText] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);

  const {
    data: item,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["details", type, id],
    queryFn: () => getDetails(type, id),
    onSuccess: () => {
      // we'll determine watchlist membership separately after fetching watchlist
    },
  });

  const mediaType = item?.type ?? type;
  const mediaId = item?.id ?? id;
  const ratingMutation = useRateMedia();
  const {
    data: userRating,
    isLoading: isUserRatingLoading,
  } = useUserRating(mediaType, mediaId, {
    enabled: !!token,
  });
  const {
    data: ratingStats,
    isLoading: isRatingStatsLoading,
  } = useRatingStats(mediaType, mediaId);

  const getNumericRating = (value) => {
    if (value === null || value === undefined) return null;
    if (typeof value === "number") return value;

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  };

  const getUserRatingValue = (value) => {
    return getNumericRating(
      value?.rating ?? value?.value ?? value?.score ?? value?.userRating
    );
  };

  const getUserReviewValue = (value) => {
    return value?.review ?? value?.comment ?? value?.text ?? "";
  };

  const getStatsValue = (value) => {
    const averageRating = getNumericRating(
      value?.averageRating ?? value?.average ?? value?.rating ?? value?.avgRating
    );
    const ratingCount =
      value?.ratingCount ?? value?.count ?? value?.totalRatings ?? value?.votes ?? null;
    const reviews = Array.isArray(value?.reviews) ? value.reviews : [];

    return { averageRating, ratingCount, reviews };
  };

  const selectedUserRating = getUserRatingValue(userRating);
  const selectedUserReview = getUserReviewValue(userRating);
  const { averageRating, ratingCount, reviews } = getStatsValue(ratingStats);
  const sortedReviews = [...reviews].sort((left, right) => {
    const leftTime = new Date(left?.createdAt ?? 0).getTime();
    const rightTime = new Date(right?.createdAt ?? 0).getTime();

    return rightTime - leftTime;
  });
  const visibleReviews = showAllComments ? sortedReviews : sortedReviews.slice(0, 3);
  const hiddenReviewCount = Math.max(0, sortedReviews.length - visibleReviews.length);

  useEffect(() => {
    if (selectedUserRating !== null && selectedUserRating !== undefined) {
      setRatingValue(selectedUserRating);
    }

    if (selectedUserReview) {
      setReviewText(selectedUserReview);
    }
  }, [selectedUserRating, selectedUserReview]);

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

  const communityScoreDisplay =
    averageRating !== null && averageRating !== undefined
      ? formatRating(averageRating)
      : "No ratings\nyet";

  const userScoreDisplay =
    selectedUserRating !== null && selectedUserRating !== undefined
      ? selectedUserRating
      : "—";

  const totalReviewsDisplay = ratingCount ?? 0;
  const ratingFill = `${((ratingValue - 1) / 9) * 100}%`;

  const handleRatingSubmit = async (event) => {
    event.preventDefault();

    if (!token) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    try {
      await ratingMutation.mutateAsync({
        mediaId,
        mediaType,
        rating: ratingValue,
        review: reviewText,
      });

      toast.success("Rating saved");
    } catch (error) {
      console.error("Rating submit error", error);
      toast.error(error?.message ?? "Failed to submit rating");
    }
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

          {/* Ratings */}
          <section className="mb-10 rounded-[1.75rem] border border-white/10 bg-[#0c0c0c] overflow-hidden shadow-[0_24px_90px_rgba(0,0,0,0.38)]">
            <div className="grid gap-0 xl:grid-cols-[1.05fr_0.95fr]">
              <div className="relative overflow-hidden border-b border-white/10 xl:border-b-0 xl:border-r xl:border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(234,179,8,0.10),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.015))] p-5 sm:p-6 lg:p-8">
                <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-yellow-500/10 to-transparent pointer-events-none" />

                <div className="flex h-full flex-col justify-between gap-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs sm:text-sm uppercase tracking-[0.35em] text-white/45">
                        Community Score
                      </div>
                    </div>

                    <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-white/40">
                      Based on {totalReviewsDisplay} review{Number(totalReviewsDisplay) === 1 ? "" : "s"}
                    </div>
                  </div>

                  <div className="">
                    <div className="text-[clamp(2.75rem,7.5vw,5.5rem)] leading-[0.88] font-serif italic text-white/35 tracking-[-0.04em] whitespace-pre-line">
                      {isRatingStatsLoading ? "Loading" : communityScoreDisplay}
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[0.98fr_1.02fr]">
                    <div className="rounded-[1.2rem] border border-white/10 bg-white/4 p-4 sm:p-4">
                      <div className="text-xs uppercase tracking-[0.3em] text-white/45 mb-2.5">Your Score</div>
                      <div className="flex items-end justify-between gap-4">
                        <div className="text-2xl sm:text-3xl font-light text-yellow-400">
                          {isUserRatingLoading ? "..." : userScoreDisplay}
                        </div>
                        <div className="flex items-center gap-1 pb-1">
                          {Array.from({ length: 10 }).map((_, index) => (
                            <span
                              key={index}
                              className={`h-3 w-3 rounded-full ${index < Math.max(0, Math.min(10, Number(selectedUserRating ?? 0)))
                                ? "bg-yellow-400/90"
                                : "bg-white/12"
                                }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-[1.2rem] border border-white/10 bg-white/4 p-4 sm:p-4">
                      <div className="text-xs uppercase tracking-[0.3em] text-white/45 mb-2.5">Total Reviews</div>
                      <div className="text-2xl sm:text-3xl font-light text-white">{totalReviewsDisplay}</div>
                    </div>
                  </div>

                  <div className="rounded-[1.2rem] border border-white/10 bg-white/4 p-4 sm:p-4.5 min-h-[5.75rem]">
                    <div className="mb-3 text-xs uppercase tracking-[0.3em] text-white/45">
                      Top Comments
                    </div>

                    {sortedReviews.length > 0 ? (
                      <div className="space-y-4">
                        {visibleReviews.map((review, index) => (
                          <div
                            key={review?._id ?? `${review?.user?._id ?? "user"}-${review?.createdAt ?? index}`}
                            className="rounded-[1rem] border border-white/8 bg-black/20 p-3.5"
                          >
                            <div className="mb-2 flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <div className="truncate text-sm font-medium text-white">
                                  {review?.user?.name ?? "Anonymous"}
                                </div>
                                <div className="text-[11px] uppercase tracking-[0.22em] text-white/30">
                                  {review?.createdAt ? new Date(review.createdAt).toLocaleDateString() : "Recently"}
                                </div>
                              </div>

                              <div className="shrink-0 rounded-full border border-yellow-400/20 bg-yellow-400/10 px-2 py-1 text-[11px] font-semibold text-yellow-300">
                                {review?.rating ?? "-"}/10
                              </div>
                            </div>

                            <p className="text-sm italic leading-relaxed text-white/65">
                              {review?.review || "No comment provided."}
                            </p>
                          </div>
                        ))}

                        {sortedReviews.length > 3 ? (
                          <button
                            type="button"
                            onClick={() => setShowAllComments((current) => !current)}
                            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-yellow-300 transition-colors hover:text-yellow-200"
                          >
                            {showAllComments ? "Show top 3" : `View all ${hiddenReviewCount + visibleReviews.length} reviews`}
                          </button>
                        ) : null}
                      </div>
                    ) : (
                      <p className="text-sm sm:text-base italic text-white/55">
                        No comments yet. Be the first to leave one.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="relative bg-[radial-gradient(circle_at_top_right,rgba(234,179,8,0.18),transparent_25%),linear-gradient(180deg,rgba(17,17,17,0.96),rgba(12,12,12,0.98))] p-5 sm:p-6 lg:p-8">
                <div className="flex h-full flex-col">
                  <div className="mb-5">
                    <div className="text-xs sm:text-sm uppercase tracking-[0.35em] text-white/45 mb-3">
                      Rate this title
                    </div>

                    <p className="text-sm sm:text-base text-white/50 leading-relaxed">
                      Pick a score from 1 - 10 and leave an optional note.
                    </p>
                  </div>

                  {!token ? (
                    <div className="rounded-[1.2rem] border border-dashed border-white/15 bg-black/20 p-4 text-sm text-gray-300">
                      Sign in to save your rating and review.
                    </div>
                  ) : (
                    <form className="flex flex-col gap-5" onSubmit={handleRatingSubmit}>
                      <div>
                        <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/45">
                          <span>Score</span>
                          <span className="text-yellow-400">{ratingValue}</span>
                        </div>

                        <input
                          type="range"
                          min="1"
                          max="10"
                          step="1"
                          value={ratingValue}
                          onChange={(event) => setRatingValue(Number(event.target.value))}
                          className="rating-slider w-full"
                          style={{ "--rating-fill": ratingFill }}
                        />

                        <div className="mt-3 flex justify-between text-sm text-white/30">
                          {Array.from({ length: 10 }).map((_, index) => (
                            <span key={index}>{index + 1}</span>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-4 text-xs uppercase tracking-[0.3em] text-white/45">
                          <label htmlFor="review">Review</label>
                          <span>Optional</span>
                        </div>

                        <textarea
                          id="review"
                          value={reviewText}
                          maxLength={300}
                          onChange={(event) => setReviewText(event.target.value)}
                          rows="5"
                          placeholder="What did you think?"
                          className="w-full min-h-[10.5rem] rounded-[1.2rem] border border-white/10 bg-white/10 px-4 py-3 text-base text-white placeholder:text-white/35 outline-none transition-colors focus:border-yellow-400/60 focus:bg-white/12"
                        />

                        <div className="text-right text-sm text-white/30">
                          {reviewText.length} / 300
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={ratingMutation.isPending}
                        className="inline-flex items-center justify-center gap-2 rounded-[1.35rem] border border-white/20 bg-white/3 px-6 py-4 text-lg font-semibold text-white transition-colors duration-300 hover:bg-white/8 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {ratingMutation.isPending ? (
                          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        ) : null}
                        Save rating
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </section>

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