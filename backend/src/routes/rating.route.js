import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { getUserRating, rateMedia } from '../controllers/rating.controller.js';

const router = Router();

router.post('/', authenticateToken, rateMedia);
router.get('/user/:mediaType/:mediaId', authenticateToken, getUserRating);

export default router;
