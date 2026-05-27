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
    type: item.media_type,
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

  // Create separate date object
  const futureDate = new Date();
  futureDate.setMonth(futureDate.getMonth() + 2);

  const maxDate = futureDate.toISOString().split('T')[0];

  const result = await axiosInstance.get('/discover/tv', {
    params: {
      include_adult: false,
      language: 'en-US',
      page: 1,
      sort_by: 'popularity.desc',

      // Upcoming within next 2 months
      'first_air_date.gte': minDate,
      'first_air_date.lte': maxDate,
    },
  });

  const upcomingShows = result.data.results
    .filter((show) => show.poster_path !== null)
    .map((show) => ({
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

  const upcomingMovies = result.data.results
    .filter((movie) => movie.poster_path !== null)
    .map((movie) => ({
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
    poster: anime.images?.jpg?.large_image_url,
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

export const trendingMovies = asyncHandler(async (req, res) => {
  const cacheKey = 'trending-movies';

  // Check cache
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    return res
      .status(200)
      .json(
        new ApiResponse(200, cachedData, 'Trending movies fetched from cache'),
      );
  }

  const result = await axiosInstance.get('/trending/movie/week');

  const movies = result.data.results
    .filter((movie) => movie.poster_path !== null)
    .map((movie) => ({
      id: movie.id,
      title: movie.title,
      type: 'movie',
      poster: movie.poster_path,
    }));

  // Cache for 10 mins
  cache.set(cacheKey, movies, 600);

  return res
    .status(200)
    .json(new ApiResponse(200, movies, 'Trending movies fetched successfully'));
});

export const trendingSeries = asyncHandler(async (req, res) => {
  const cacheKey = 'trending-series';

  // Check cache
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    return res
      .status(200)
      .json(
        new ApiResponse(200, cachedData, 'Trending series fetched from cache'),
      );
  }

  const result = await axiosInstance.get('/trending/tv/week');

  const shows = result.data.results
    .filter((show) => show.poster_path !== null)
    .map((show) => ({
      id: show.id,
      title: show.name,
      type: 'tv',
      poster: show.poster_path,
    }));

  // Cache for 10 mins
  cache.set(cacheKey, shows, 600);

  return res
    .status(200)
    .json(new ApiResponse(200, shows, 'Trending movies fetched successfully'));
});

export const trendingAnimes = asyncHandler(async (req, res) => {
  const cacheKey = 'trending-animes';

  // Check cache
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    return res
      .status(200)
      .json(
        new ApiResponse(200, cachedData, 'Trending animes fetched from cache'),
      );
  }

  const results = await axios.get('https://api.jikan.moe/v4/seasons/now');

  const trendingAnimes = results.data.data.map((anime) => ({
    id: anime.mal_id,
    title: anime.title_english,
    type: 'anime',
    poster: anime.images?.jpg?.large_image_url,
  }));

  cache.set(cacheKey, trendingAnimes, 3600);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        trendingAnimes,
        'Trending animes fetched successfully',
      ),
    );
});

export const topRatedMovies = asyncHandler(async (req, res) => {
  const cacheKey = 'top-rated-movies';

  // Check cache
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    return res
      .status(200)
      .json(
        new ApiResponse(200, cachedData, 'Top rated movies fetched from cache'),
      );
  }

  const result = await axiosInstance.get('/movie/top_rated');

  const top10 = result.data.results.slice(0, 10);

  const detailedMovies = await Promise.all(
    top10.map(async (movie) => {
      const detailsRes = await axiosInstance.get(`/movie/${movie.id}`, {
        params: {
          append_to_response: 'credits,videos',
        },
      });

      const details = detailsRes.data;

      const director = details.credits?.crew?.find(
        (member) => member.job === 'Director',
      );

      return {
        id: details.id,
        title: details.title,
        type: 'movie',
        overview: details.overview,
        poster: details.poster_path,
        genres: details.genres?.map((g) => g.name) || [],
        runtime: details.runtime,
        language: details.spoken_languages?.[0]?.english_name,
        rating: details.vote_average,
        votes: details.vote_count,
        releaseDate: details.release_date,
        director: director?.name || null,
        popularity: details.popularity,
      };
    }),
  );

  // Cache for 2 hours
  cache.set(cacheKey, detailedMovies, 7200);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        detailedMovies,
        'Top rated movies fetched successfully',
      ),
    );
});

export const topRatedSeries = asyncHandler(async (req, res) => {
  const cacheKey = 'top-rated-series';

  // Check cache
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    return res
      .status(200)
      .json(
        new ApiResponse(200, cachedData, 'Top rated series fetched from cache'),
      );
  }

  const result = await axiosInstance.get('/tv/top_rated');

  const top10 = result.data.results.slice(0, 10);

  const detailedSeries = await Promise.all(
    top10.map(async (series) => {
      const detailsRes = await axiosInstance.get(`/tv/${series.id}`, {
        params: {
          append_to_response: 'credits,videos',
        },
      });

      const details = detailsRes.data;

      return {
        id: details.id,
        title: details.name,
        type: 'tv',
        overview: details.overview,
        poster: details.poster_path,
        genres: details.genres?.map((g) => g.name) || [],
        runtime: details.episode_run_time?.[0] || null,
        language: details.spoken_languages?.[0]?.english_name,
        rating: details.vote_average,
        votes: details.vote_count,
        releaseDate: details.first_air_date,
        creators: details.created_by?.map((creator) => creator.name) || [],
        popularity: details.popularity,
      };
    }),
  );

  // Cache for 2 hours
  cache.set(cacheKey, detailedSeries, 7200);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        detailedSeries,
        'Top rated series fetched successfully',
      ),
    );
});

export const topRatedAnimes = asyncHandler(async (req, res) => {
  const cacheKey = 'top-rated-anime';

  // Check cache
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    return res
      .status(200)
      .json(
        new ApiResponse(200, cachedData, 'Top rated anime fetched from cache'),
      );
  }

  const result = await axios.get('https://api.jikan.moe/v4/top/anime');

  const top10 = result.data.data.slice(0, 10);

  const detailedAnime = top10.map((anime, index) => ({
    rank: index + 1,
    id: anime.mal_id,
    title: anime.title,
    type: 'anime',
    animeType: anime.type,
    overview: anime.synopsis,
    poster: anime.images?.jpg?.large_image_url,
    genres: anime.genres?.map((genre) => genre.name) || [],
    episodes: anime.episodes,
    language: 'Japanese',
    rating: anime.score,
    votes: anime.scored_by,
    releaseDate: anime.aired?.from,
    studios: anime.studios?.map((studio) => studio.name) || [],
    popularity: anime.popularity,
    status: anime.status,
    year: anime.year,
    season: anime.season,
  }));

  // Cache for 2 hours
  cache.set(cacheKey, detailedAnime, 7200);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        detailedAnime,
        'Top rated anime fetched successfully',
      ),
    );
});

export const trendingMangas = asyncHandler(async (req, res) => {
  const cacheKey = 'trending-manga';

  const snapshotKey = 'manga-chapter-snapshots';

  // Check final trending cache
  const cachedTrending = cache.get(cacheKey);

  if (cachedTrending) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          cachedTrending,
          'Trending manga fetched from cache',
        ),
      );
  }

  // Previous snapshot
  const previousSnapshot = cache.get(snapshotKey) || {};

  // Fetch publishing manga
  const result = await axios.get('https://api.jikan.moe/v4/manga', {
    params: {
      status: 'publishing',
      order_by: 'members',
      sort: 'desc',
      limit: 25,
    },
  });

  const mangaList = result.data.data;

  // Find highest members count
  // used for popularity normalization
  const maxMembers = Math.max(...mangaList.map((m) => m.members || 0));

  // Store updated chapter counts
  const newSnapshot = {};

  const transformed = mangaList.map((manga) => {
    const currentChapters = manga.chapters || 0;

    const previousChapters = previousSnapshot[manga.mal_id] || 0;

    // Detect chapter update
    const updated =
      previousChapters !== 0 && currentChapters > previousChapters;

    // Save latest snapshot
    newSnapshot[manga.mal_id] = currentChapters;

    // Popularity score
    // normalized between 0 → 20
    const popularityScore = ((manga.members || 0) / maxMembers) * 20;

    // Update score
    // updated manga heavily prioritized
    const updateScore = updated ? 80 : 0;

    // Final weighted score
    const trendingScore = updateScore + popularityScore;

    return {
      id: manga.mal_id,
      title: manga.title,
      type: 'manga',
      poster: manga.images?.jpg?.large_image_url,
      updated,
      trendingScore: Number(trendingScore.toFixed(2)),
    };
  });

  // Sort by weighted trending score
  transformed.sort((a, b) => b.trendingScore - a.trendingScore);

  // Return top 10 only
  const finalTrending = transformed.slice(0, 10);

  // Save chapter snapshot
  cache.set(snapshotKey, newSnapshot, 86400);

  // Cache final result
  cache.set(cacheKey, finalTrending, 3600);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        finalTrending,
        'Trending manga fetched successfully',
      ),
    );
});

export const topRatedMangas = asyncHandler(async (req, res) => {
  const cacheKey = 'top-rated-mangas';

  // Check cache
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    return res
      .status(200)
      .json(
        new ApiResponse(200, cachedData, 'Top rated mangas fetched from cache'),
      );
  }

  // Fetch top rated manga
  const result = await axios.get('https://api.jikan.moe/v4/top/manga', {
    params: {
      limit: 10,
    },
  });

  const mangaList = result.data.data;

  // Transform response
  const transformed = mangaList.map((manga, index) => ({
    rank: index + 1,
    id: manga.mal_id,
    title: manga.title,
    type: 'manga',
    overview: manga.synopsis,
    poster: manga.images?.jpg?.large_image_url,
    genres: manga.genres?.map((genre) => genre.name) || [],
    chapters: manga.chapters,
    volumes: manga.volumes,
    rating: manga.score,
    votes: manga.scored_by,
    popularity: manga.popularity,
    members: manga.members,
    status: manga.status,
    releaseDate: manga.published?.from,
    authors: manga.authors?.map((author) => author.name) || [],
    serializations:
      manga.serializations?.map((serialization) => serialization.name) || [],
  }));

  // Cache for 2 hours
  cache.set(cacheKey, transformed, 7200);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        transformed,
        'Top rated mangas fetched successfully',
      ),
    );
});

export const recommendedMangas = asyncHandler(async (req, res) => {
  const cacheKey = 'recommended-mangas';

  // Check cache
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          cachedData,
          'Recommended mangas fetched from cache',
        ),
      );
  }

  const result = await axios.get(
    'https://api.jikan.moe/v4/recommendations/manga',
  );

  // Transform response
  const recommendations = result.data.data.slice(0, 10).map((item, index) => {
    const entry = item.entry?.[0];

    return {
      id: entry?.mal_id,
      title: entry?.title,
      type: 'manga',
      poster: entry?.images?.jpg?.large_image_url,
    };
  });

  // Cache for 2 hours
  cache.set(cacheKey, recommendations, 7200);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        recommendations,
        'Recommended mangas fetched successfully',
      ),
    );
});
