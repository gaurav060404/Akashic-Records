import { useQuery } from "@tanstack/react-query";
import { getUserRating, getRatingStats } from "../services/ratingService.js";

export const useUserRating = (mediaType, mediaId, options = {}) => {
  const { enabled = true, ...queryOptions } = options;

  return useQuery({
    ...queryOptions,
    queryKey: ["user-rating", mediaType, mediaId],
    queryFn: () => getUserRating(mediaType, mediaId),
    enabled: enabled && !!mediaType && !!mediaId,
  });
};

export const useRatingStats = (mediaType, mediaId, options = {}) => {
  const { enabled = true, ...queryOptions } = options;

  return useQuery({
    ...queryOptions,
    queryKey: ["rating-stats", mediaType, mediaId],
    queryFn: () => getRatingStats(mediaType, mediaId),
    enabled: enabled && !!mediaType && !!mediaId,
  });
};
