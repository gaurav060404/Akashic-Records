import { Router } from 'express';
import {
  carouselPosters,
  getTrending,
  recommendedMangas,
  topCreators,
  topRatedAnimes,
  topRatedMangas,
  topRatedMovies,
  topRatedSeries,
  trendingAnimes,
  trendingMangas,
  trendingMovies,
  trendingSeries,
  upcomingAnimes,
  upcomingMovies,
  upcomingSeries,
} from '../controllers/tmdb.controller.js';

const router = Router();

router.get('/posters', carouselPosters);
router.get('/top-creators', topCreators);
router.get('/trending', getTrending);
router.get('/trending/movies', trendingMovies);
router.get('/trending/series', trendingSeries);
router.get('/trending/animes', trendingAnimes);
router.get('/trending/mangas', trendingMangas);
router.get('/movie/upcoming', upcomingMovies);
router.get('/movie/top-rated', topRatedMovies);
router.get('/anime/upcoming', upcomingAnimes);
router.get('/series/upcoming', upcomingSeries);
router.get('/series/top-rated', topRatedSeries);
router.get('/anime/top-rated', topRatedAnimes);
router.get('/manga/recommended', recommendedMangas);
router.get('/manga/top-rated', topRatedMangas);

export default router;
