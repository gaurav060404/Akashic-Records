import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://api.tmdb.org/3',
  params: {
    api_key: process.env.TMDB_API_KEY,
  },
});

export const getDetails = asyncHandler(async (req, res) => {
  const { id, type } = req.params;

  let data;

  if (type === 'movie' || (type === 'tv' || type === "series")) {
    const endpoint = type === 'movie' ? `/movie/${id}` : `/tv/${id}`;

    const result = await axiosInstance.get(endpoint, {
      params: {
        language: 'en-US',
        append_to_response: 'credits,videos',
      },
    });

    const item = result.data;

    const director = item.credits?.crew?.find(
      (person) => person.job === 'Director',
    );

    const trailer = item.videos?.results?.find(
      (video) => video.type === 'Trailer' && video.site === 'YouTube',
    );

    data = {
      id: item.id,
      title: item.title || item.name,
      overview: item.overview,
      poster: item.poster_path,
      backdrop: item.backdrop_path,
      rating: item.vote_average,
      genres: item.genres || [],
      releaseDate: item.release_date || item.first_air_date,
      runtime: item.runtime || item.episode_run_time?.[0] || null,
      seasons: type === 'tv' ? item.number_of_seasons : null,
      popularity: item.popularity,
      director: director?.name || 'Unknown',
      trailer: trailer
        ? `https://www.youtube.com/watch?v=${trailer.key}`
        : null,
      credits:
        item.credits?.cast?.slice(0, 12).map((cast) => ({
          name: cast.name,
          character: cast.character,
          image: cast.profile_path,
        })) || [],
      type,
    };
  } else if (type === 'anime') {
    const [detailsRes, charactersRes] = await Promise.all([
      axios.get(`https://api.jikan.moe/v4/anime/${id}/full`),

      axios.get(`https://api.jikan.moe/v4/anime/${id}/characters`),
    ]);

    const anime = detailsRes.data.data;

    const characters = charactersRes.data.data || [];

    data = {
      id: anime.mal_id,
      title: anime.title,
      overview: anime.synopsis,
      poster:
        anime.images?.jpg?.large_image_url ||
        anime.images?.jpg?.image_url ||
        null,
      backdrop:
        anime.trailer?.images?.maximum_image_url ||
        anime.images?.jpg?.large_image_url ||
        null,
      rating: anime.score,
      genres: anime.genres || [],
      releaseDate: anime.aired?.from,
      runtime: anime.duration,
      episodes: anime.episodes,
      status: anime.status,
      popularity: anime.popularity,
      studio: anime.studios?.[0]?.name || 'Unknown',
      trailer: anime.trailer?.url || null,
      credits:
        characters.slice(0, 12).map((char) => ({
          name: char.character?.name,
          character: char.role,
          image: char.character?.images?.jpg?.image_url || null,
        })) || [],
      type,
    };
  } else {
    throw new ApiError(400, 'Invalid type');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, data, 'Details fetched successfully'));
});
