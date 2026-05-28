import axios from 'axios';
import { normalizeJikan } from './normalizeJikan.js';
import { normalizeTMDB } from './normalizeTmdb.js';

const tmdb = axios.create({
  baseURL: 'https://api.tmdb.org/3',
  params: {
    api_key: process.env.TMDB_API_KEY,
  },
});

const jikan = axios.create({
  baseURL: 'https://api.jikan.moe/v4',
});

const searchTMDB = async (query, type, page) => {
  const endpoint =
    type === 'movie'
      ? '/search/movie'
      : type === 'tv'
        ? '/search/tv'
        : '/search/multi';

  const response = await tmdb.get(endpoint, {
    params: {
      query,
      page,
    },
  });

  return response.data.results;
};

const searchAnime = async (query, page) => {
  const response = await jikan.get('/anime', {
    params: {
      q: query,
      page,
    },
  });

  return response.data.data;
};

const searchManga = async (query, page) => {
  const response = await jikan.get('/manga', {
    params: {
      q: query,
      page,
    },
  });

  return response.data.data;
};

export const searchMedia = async (query, type, page) => {
  let results = [];

  switch (type) {
    case 'movie':
    case 'tv': {
      const tmdbResults = await searchTMDB(query, type, page);
      results = tmdbResults.map((item) => normalizeTMDB(item, type));
      break;
    }
    case 'anime': {
      const animeResults = await searchAnime(query, page);
      results = animeResults.map((item) => normalizeJikan(item, 'anime'));
      break;
    }
    case 'manga': {
      const mangaResults = await searchManga(query, page);
      results = mangaResults.map((item) => normalizeJikan(item, 'manga'));
      break;
    }
    case 'all':
    default: {
      const [tmdbResults, animeResults, mangaResults] = await Promise.all([
        searchTMDB(query, 'multi', page),
        searchAnime(query, page),
        searchManga(query, page),
      ]);

      results = [
        ...tmdbResults.map((item) => normalizeTMDB(item, item.media_type)),
        ...animeResults.map((item) => normalizeJikan(item, 'anime')),
        ...mangaResults.map((item) => normalizeJikan(item, 'manga')),
      ];
      break;
    }
  }
  return results;
};
