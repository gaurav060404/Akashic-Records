import Rating from '../models/ratingModel.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import User from '../models/userModel.js';

const fetchMediaReviews = async ({ mediaId, mediaType }) => {
  return Rating.find({
    mediaId,
    mediaType,
    review: { $exists: true, $ne: '' },
  })
    .populate('user', 'name avatar')
    .sort({ createdAt: -1 });
};

export const rateMedia = asyncHandler(async (req, res) => {
  const { mediaId, mediaType, rating, review = '', title, poster } = req.body;

  const userId = req.user.id;

  const data = await Rating.findOneAndUpdate(
    {
      user: userId,
      mediaId,
      mediaType,
    },
    {
      $set: {
        rating,
        review,
        title,
        poster,
      },
    },
    {
      upsert: true,
      new: true,
      runValidators: true,
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

  const [stats, reviews] = await Promise.all([
    Rating.aggregate([
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
    ]),
    fetchMediaReviews({ mediaId, mediaType }),
  ]);

  return res.status(200).json(
    new ApiResponse(200, {
      ...(stats[0] || {
        averageRating: 0,
        totalRatings: 0,
      }),
      reviews,
    }),
  );
});

export const getMediaReviews = asyncHandler(async (req, res) => {
  const { mediaId, mediaType } = req.params;

  const reviews = await fetchMediaReviews({ mediaId, mediaType });

  return res
    .status(200)
    .json(new ApiResponse(200, reviews, 'Reviews fetched successfully'));
});

export const getAllRatingsFromUser = asyncHandler(async (req, res) => {
  const { id } = req.user;

  const ratings = await Rating.find({ user: id }).sort({
    updatedAt: -1,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, ratings, 'Ratings & Reviews fetched successfully'),
    );
});

export const deleteRating = asyncHandler(async (req, res) => {
  const { mediaId, mediaType } = req.params;

  const rating = await Rating.findOneAndDelete({
    user: req.user.id,
    mediaId,
    mediaType,
  });

  if (!rating) {
    throw new ApiError(404, 'Rating not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, 'Rating/Review deleted successfully'));
});
