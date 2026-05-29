import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import {
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

export default router;
