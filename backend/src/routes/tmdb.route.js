import { Router } from 'express';
import {
  carouselPosters,
  getTrending,
  topCreators,
  trendingMovies,
  upcomingAnimes,
  upcomingMovies,
  upcomingSeries,
} from '../controllers/tmdb.controllers.js';

const router = Router();

router.get('/posters', carouselPosters);
router.get('/trending', getTrending);
router.get('/upcomingSeries', upcomingSeries);
router.get('/upcomingMovies', upcomingMovies);
router.get('/upcomingAnimes', upcomingAnimes);
router.get('/top-creators', topCreators);
router.get('/trending/movies', trendingMovies);

export default router;
