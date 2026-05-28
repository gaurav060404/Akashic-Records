import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import {
  getWatchlist,
  toggleWatchlist,
} from '../controllers/watchlist.controller.js';

const router = Router();

router.get('/', authenticateToken, getWatchlist);
router.post('/toggle', authenticateToken, toggleWatchlist);

export default router;
