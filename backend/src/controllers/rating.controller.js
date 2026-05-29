import Rating from '../models/ratingModel.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';

export const rateMedia = asyncHandler(async (req, res) => {
  const { mediaId, mediaType, rating, review } = req.body;

  const userId = req.user.id;

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
      returnDocument: 'after',
    },
  );

  return res
    .status(200)
    .json(new ApiResponse(200, data, 'Rating saved successfully'));
});

export const getUserRating = asyncHandler(async (req, res) => {
  const { mediaId, mediaType } = req.params;

  const rating = await Rating.findOne({
    user: req.user.id,
    mediaId,
    mediaType,
  });

  return res.status(200).json(new ApiResponse(200, rating));
});

export const getRatingStats = asyncHandler(async (req, res) => {
  const { mediaId, mediaType } = req.params;

  const stats = await Rating.aggregate([
    {
      $match: {
        mediaId,
        mediaType,
      },
    },
    {
      $group: {
        _id: null,
        averageRating: {
          $avg: '$rating',
        },
        totalRatings: {
          $sum: 1,
        },
      },
    },
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      stats[0] || {
        averageRating: 0,
        totalRatings: 0,
      },
    ),
  );
});
