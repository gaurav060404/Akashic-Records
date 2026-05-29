import Rating from '../models/ratingModel.js';

export const rateMedia = asyncHandler(async (req, res) => {
  const { mediaId, mediaType, rating, review } = req.body;

  const userId = req.user._id;

  const data = await Rating.findOneAndUpdate(
    {
      user: userId,
      mediaId,
      mediaType,
    },
    {
      rating,
      review,
    },
    {
      upsert: true,
      new: true,
    },
  );

  return res
    .status(200)
    .json(new ApiResponse(200, data, 'Rating saved successfully'));
});

export const getUserRating = asyncHandler(async (req, res) => {
  const { mediaId, mediaType } = req.params;

  const rating = await Rating.findOne({
    user: req.user._id,
    mediaId,
    mediaType,
  });

  return res.status(200).json(new ApiResponse(200, rating));
});
