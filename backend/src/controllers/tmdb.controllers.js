import axios from 'axios';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import cache from '../utils/cache.js';

const date = new Date();
const year = date.getFullYear();
const month = String(date.getMonth() + 1).padStart(2, '0'); // 2-digit month
const day = String(date.getDate()).padStart(2, '0'); // 2-digit day
const formattedDate = `${year}-${month}-${day}`;

const axiosInstance = axios.create({
  baseURL: 'https://api.tmdb.org/3', // used api.tmdb.org instead of api.themoviedb.org due to ISP blocks
  params: {
    api_key: process.env.TMDB_API_KEY,
  },
});

export const carouselPosters = asyncHandler(async (req, res) => {
  const cacheKey = 'carousel-posters';

  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    return res
      .status(200)
      .json(new ApiResponse(200, cachedData, 'Fetched from cache'));
  }

  const result = await axiosInstance.get('/movie/popular');

  const carouselItems = result.data.results.map((movie) => ({
    id: movie.id,
    title: movie.title,
    backdrop: movie.backdrop_path,
  }));

  cache.set(cacheKey, carouselItems);

  return res
    .status(200)
    .json(new ApiResponse(200, carouselItems, 'Fetched successfully'));
});

export const getTrending = asyncHandler(async (req, res) => {
  const cacheKey = 'trending-home-page';

  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    return res
      .status(200)
      .json(
        new ApiResponse(200, cachedData, 'Trending data fetched successfully'),
      );
  }

  const result = await axiosInstance.get('/trending/all/week');

  const trendingItems = result.data.results.map((item) => ({
    id: item.id,
    title: item.title || item.name,
    poster: item.poster_path,
  }));

  cache.set(cacheKey, trendingItems);

  return res
    .status(200)
    .json(new ApiResponse(200, trendingItems, 'Trending fetched successfully'));
});

export const upcomingSeries = asyncHandler(async (req, res) => {
  const cacheKey = 'upcoming-series';

  // Check cache
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    return res
      .status(200)
      .json(
        new ApiResponse(200, cachedData, 'Upcoming series fetched from cache'),
      );
  }

  const today = new Date();

  const minDate = today.toISOString().split('T')[0];

  const maxDate = new Date(today.setMonth(today.getMonth() + 2))
    .toISOString()
    .split('T')[0];

  const result = await axiosInstance.get('/discover/tv', {
    params: {
      include_adult: false,
      language: 'en-US',
      page: 1,
      sort_by: 'popularity.desc',

      'first_air_date.gte': minDate,
      'first_air_date.lte': maxDate,
    },
  });

  const upcomingShows = result.data.results.map((show) => ({
    id: show.id,
    title: show.name,
    type: 'tv',
    poster: show.poster_path,
  }));

  cache.set(cacheKey, upcomingShows, 3600);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        upcomingShows,
        'Upcoming series fetched successfully',
      ),
    );
});

export const upcomingMovies = asyncHandler(async (req, res) => {
  const cacheKey = 'upcoming-movies';

  // Check cache
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    return res
      .status(200)
      .json(
        new ApiResponse(200, cachedData, 'Upcoming movies fetched from cache'),
      );
  }

  const today = new Date();

  const minDate = today.toISOString().split('T')[0];

  const maxDate = new Date(today.setMonth(today.getMonth() + 2))
    .toISOString()
    .split('T')[0];

  const result = await axiosInstance.get('/movie/upcoming', {
    params: {
      include_adult: false,
      language: 'en-US',
      page: 1,
      sort_by: 'popularity.desc',
      'primary_release_date.gte': minDate,
      'primary_release_date.lte': maxDate,
    },
  });

  const upcomingMovies = result.data.results.map((movie) => ({
    id: movie.id,
    title: movie.title,
    type: 'movie',
    poster: movie.poster_path,
  }));

  cache.set(cacheKey, upcomingMovies, 3600);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        upcomingMovies,
        'Upcoming movie fetched successfully',
      ),
    );
});

export const upcomingAnimes = asyncHandler(async (req, res) => {
  const cacheKey = 'upcoming-animes';

  // Check cache
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    return res
      .status(200)
      .json(
        new ApiResponse(200, cachedData, 'Upcoming animes fetched from cache'),
      );
  }

  const results = await axios.get('https://api.jikan.moe/v4/seasons/upcoming');

  const upcomingAnime = results.data.data.map((anime) => ({
    id: anime.mal_id,
    title: anime.title_english,
    type: 'anime',
    poster: anime.images.jpg.image_url,
  }));

  cache.set(cacheKey, upcomingAnime, 3600);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        upcomingAnime,
        'Upcoming animes fetched successfully',
      ),
    );
});

export const topCreators = asyncHandler(async (req, res) => {
  const cacheKey = 'top-creators';

  // Check cache
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    return res
      .status(200)
      .json(
        new ApiResponse(200, cachedData, 'Top creators fetched from cache'),
      );
  }

  const result = await axiosInstance.get('/trending/all/week');

  const filtered = result.data.results.filter(
    (item) => item.media_type === 'movie' || item.media_type === 'tv',
  );

  const detailedItems = await Promise.all(
    filtered.map(async (item) => {
      // Movies
      if (item.media_type === 'movie') {
        const creditsRes = await axiosInstance.get(`/movie/${item.id}/credits`);

        const directors = creditsRes.data.crew.filter(
          (member) => member.job === 'Director',
        );

        return {
          item,
          creators: directors,
        };
      }

      // TV Shows
      else {
        const tvRes = await axiosInstance.get(`/tv/${item.id}`);

        return {
          item,
          creators: tvRes.data.created_by || [],
        };
      }
    }),
  );

  // Aggregate creators
  const creatorsMap = new Map();

  detailedItems.forEach(({ item, creators }) => {
    creators.forEach((creator) => {
      if (!creator.id) return;

      if (!creatorsMap.has(creator.id)) {
        creatorsMap.set(creator.id, {
          id: creator.id,
          name: creator.name,
          profile: creator.profile_path,
          count: 0,
          works: [],
        });
      }

      const existing = creatorsMap.get(creator.id);
      existing.count++;
      existing.works.push({
        id: item.id,
        title: item.title || item.name,
        type: item.media_type,
        poster: item.poster_path,
        rating: item.vote_average,
      });
    });
  });

  // Sort by popularity
  const topCreators = Array.from(creatorsMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Cache for 1 hour
  cache.set(cacheKey, topCreators, 3600);

  return res
    .status(200)
    .json(
      new ApiResponse(200, topCreators, 'Top creators fetched successfully'),
    );
});

export const trendingMovies = asyncHandler(
  async (req, res) => {

    const cacheKey = "trending-movies";

    // Check cache
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      return res.status(200).json(
        new ApiResponse(
          200,
          cachedData,
          "Trending movies fetched from cache"
        )
      );
    }

    const result = await axiosInstance.get(
      "/trending/movie/week"
    );

    const movies =
      result.data.results.map((movie) => ({
        id: movie.id,
        title: movie.title,
        type: "movie",
        poster: movie.poster_path
      }));

    // Cache for 10 mins
    cache.set(
      cacheKey,
      movies,
      600
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        movies,
        "Trending movies fetched successfully"
      )
    );
  }
);