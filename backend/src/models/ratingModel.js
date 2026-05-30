import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    mediaId: {
      type: String,
      required: true,
    },
    mediaType: {
      type: String,
      enum: ['movie', 'series', 'anime', 'manga'],
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    review: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    poster: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  },
);

ratingSchema.index(
  {
    user: 1,
    mediaId: 1,
    mediaType: 1,
  },
  {
    unique: true,
  },
);

export default mongoose.model('Rating', ratingSchema);
