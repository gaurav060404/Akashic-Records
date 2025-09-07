import express from 'express';
import passport from 'passport';
import { login, signup, logout, googleCallback, getWatchlist, toggleWatchlistItem } from './controllers/authController.js';
import { authenticateToken } from './middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', authenticateToken, logout);

// Google OAuth routes
router.get('/google', 
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    session: false 
  })
);

router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: '/login',
    session: false
  }),
  googleCallback
);

router.get('/watchlist', authenticateToken, getWatchlist);
router.post('/watchlist/toggle', authenticateToken, toggleWatchlistItem);

export default router;