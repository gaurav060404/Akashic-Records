import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitRating } from "../services/ratingService";

export const useRateMedia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitRating,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["user-rating", variables.mediaType, variables.mediaId],
      });

      queryClient.invalidateQueries({
        queryKey: ["rating-stats", variables.mediaType, variables.mediaId],
      });
    },
  });
};
