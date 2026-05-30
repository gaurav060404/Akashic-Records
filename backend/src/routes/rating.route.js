import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import {
  deleteRating,
  getAllRatingsFromUser,
  getMediaReviews,
  getRatingStats,
  getUserRating,
  rateMedia,
} from '../controllers/rating.controller.js';

const router = Router();

router.post('/', authenticateToken, rateMedia);
router.get('/user/:mediaType/:mediaId', authenticateToken, getUserRating);
router.get('/stats/:mediaType/:mediaId', authenticateToken, getRatingStats);
router.get('/reviews/:mediaType/:mediaId', getMediaReviews);
router.delete('/reviews/:mediaType/:mediaId', authenticateToken, deleteRating);
router.get('/', authenticateToken, getAllRatingsFromUser);

export default router;
