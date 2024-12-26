import { atom, selector } from "recoil";
import axios from "axios";

// Selector to fetch and process the trending data
export const allStateSelector = selector({
  key: "allStateSelector",
  get: async () => {
    try {
      const seriesResult = await axios.get(
        "https://api.themoviedb.org/3/trending/all/week",
        {
          params: {
            api_key: import.meta.env.VITE_SECRET_KEY,
          },
        }
      );
      const seriesData = seriesResult.data;
      const filteredSeries = seriesData.results.filter((series) => {
        return !(series.original_language === "ja" && !series.adult);
      });
      return filteredSeries.map((trendingSMA) => {
        return {
          id: trendingSMA.id,
          posterPath: trendingSMA.poster_path,
          posterName: trendingSMA.title ? trendingSMA.title : trendingSMA.name,
          backDropPath: trendingSMA.backdrop_path,
          overview : trendingSMA.overview
        };
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  },
});

export const movieSelector = selector({
  key: "movieSelector",
  get: async function getPoster() {
    try {
      //movies
      const movieResult = await axios.get(
        "https://api.themoviedb.org/3/trending/movie/week",
        {
          params: {
            api_key: import.meta.env.VITE_SECRET_KEY,
          },
        }
      );
      const movieData = movieResult.data;
      return movieData.results.map((movie) => {
        return {
          id: movie.id,
          posterPath: movie.poster_path,
          posterName: movie.title,
          backDropPath: movie.backdrop_path,
          overview : movie.overview
        };
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  },
});

export const seriesSelector = selector({
  key: "seriesSelector",
  get: async function getPoster() {
    try {
      //series
      const seriesResult = await axios.get(
        "https://api.themoviedb.org/3/trending/tv/week",
        {
          params: {
            api_key: import.meta.env.VITE_SECRET_KEY,
          },
        }
      );
      const seriesData = seriesResult.data;
      const filteredSeries = seriesData.results.filter((series) => {
        return !(series.original_language === "ja" && !series.adult);
      });
      
      const seriesWithDetails = await Promise.all(
        filteredSeries.map(async (series) => {
          const details = await axios.get(`https://api.themoviedb.org/3/tv/${series.id}`, {
            params: {
              api_key: import.meta.env.VITE_SECRET_KEY,
            },
          });
          return {
            id: series.id,
            posterPath: series.poster_path,
            posterName: series.name,
            backDropPath: series.backdrop_path,
            genres: details.data.genres,
            languages: details.data.spoken_languages,
            releaseDate: details.data.first_air_date,
            seasons: details.data.number_of_seasons,
            directedBy : details.data.created_by,
            networks : details.data.networks,
            overview : series.overview
          };
        })
      );
      return seriesWithDetails;
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  },
});

export const animeSelector = selector({
  key: 'animeSelector',
  get: async function getAnime() {
    try {
      const result = await axios.get('https://api.jikan.moe/v4/seasons/now');
      const animes = result.data.data;
      return animes.map((anime) => {
        return {
          id: anime.mal_id,
          posterPath: anime.images.jpg.image_url,
          posterName: anime.title_english,
          backDropPath: anime.trailer.images.maximum_image_url,
          overview : anime.synopsis
        }
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  }
});

export const shuffledPostersState = atom({
  key: 'shuffledPostersState',
  default: [],
});

export const posterState = atom({
  key: 'posterState',
  default: [],
});

export const shuffledUpcomingPostersState = atom({
  key: 'shuffledUpcomingPostersState',
  default: [],
});

export const upcomingPosterState = atom({
  key: 'upcomingPosterState',
  default: [],
});

export const carouselPosters = selector({
  key: 'carouselPosters',
  get: async function fetchImage() {
    try {
      const result = await axios.get(`https://api.themoviedb.org/3/movie/popular`, {
        params: {
          api_key: import.meta.env.VITE_SECRET_KEY
        }
      });
      const data = result.data;
      return data.results.map(movie => movie.backdrop_path);
    } catch (error) {
      console.log('Error fetching data : ', error);
      return [];
    }
  }
});

export const slides = atom({
  key: 'slides',
  default: 0
});

export const popularMovies = selector({
  key: 'popularMovies',
  get: async function getPopularTVShows() {
    try {
      const result = await axios.get('https://api.themoviedb.org/3/movie/upcoming', {
        params: {
          api_key: import.meta.env.VITE_SECRET_KEY
        }
      });
      const movies = result.data;
      return  movies.results.map((movie) => {
        console.log(movie.overview);
        return {
          id: movie.id,
          posterPath: movie.poster_path,
          posterName: movie.title,
          backDropPath: movie.backdrop_path,
          overview : movie.overview
        };
      });
    } catch (error) {
      console.error("Error while fetching the tv shows ", error);
      return [];
    }
  }
});

export const topRatedMovies = selector({
  key: 'topRatedMovies',
  get: async function getTopRatedMovies() {
    try {
      const result = await axios.get('https://api.themoviedb.org/3/movie/top_rated', {
        params: {
          api_key: import.meta.env.VITE_SECRET_KEY
        }
      });
      const topRated = result.data;

      const moviesWithDetails = await Promise.all(
        topRated.results.map(async (movie) => {
          const res = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}`, {
            params: {
              api_key: import.meta.env.VITE_SECRET_KEY
            }
          });
          const detail = res.data;
          return {
            id: movie.id,
            title: movie.title,
            posterName : movie.title,
            posterPath: movie.poster_path,
            backDropPath: movie.backdrop_path,
            overview: movie.overview,
            popularity: movie.popularity,
            rating: movie.vote_average,
            users: movie.vote_count,
            genres: detail.genres,
            languages: detail.spoken_languages,
            releaseDate: movie.release_date,
            runtime: detail.runtime
          };
        })
      );

      return moviesWithDetails;
    } catch (error) {
      console.error('Error fetching top-rated movies:', error);
      return [];
    }
  }
});

export const topRatedSeries = selector({
  key: 'topRatedSeries',
  get: async function getRatedSeries() {
    try {
      const result = await axios.get('https://api.themoviedb.org/3/tv/top_rated', {
        params: {
          api_key: import.meta.env.VITE_SECRET_KEY
        }
      });
      const topRated = result.data.results;
      const filteredSeriesWithDetails = topRated.filter((series) => {
        return series.origin_country[0] !== "JP" && !series.isAdult
      });
      const seriesWithDetails = await Promise.all(
        filteredSeriesWithDetails.map(async (series) => {
          const res = await axios.get(`https://api.themoviedb.org/3/tv/${series.id}`, {
            params: {
              api_key: import.meta.env.VITE_SECRET_KEY
            }
          });
          const detail = res.data;
          return {
            id: series.id,
            title: series.name,
            posterName : series.name,
            posterPath: series.poster_path,
            backDropPath: series.backdrop_path,
            overview: series.overview,
            popularity: series.popularity,
            rating: series.vote_average,
            users: series.vote_count,
            genres: detail.genres,
            languages: detail.spoken_languages,
            releaseDate: series.first_air_date,
            runtime: detail.seasons[0].episode_count,
            seasons: detail.number_of_seasons,
            directedBy : detail.created_by,
            networks : detail.networks
          };
        })
      );
      return seriesWithDetails;
    } catch (error) {
      console.error('Error fetching top-rated series:', error);
      return [];
    }
  }
});

export const ratedPosterState = atom({
  key: 'ratedPosterState',
  default: []
});

export const topRatedAnimes = selector({
  key: 'topRatedAnimes',
  get: async function getRatedSeries() {
    try {
      const result = await axios.get('https://api.jikan.moe/v4/top/anime');
      const topRated = result.data.data;
      return topRated.map((anime) => {
          return {
            id: anime.mal_id,
            title: anime.titles[0].title,
            posterName : anime.titles[0].title,
            posterPath: anime.images.jpg.image_url,
            backDropPath: anime.trailer.images.maximum_image_url,
            overview: anime.synopsis,
            popularity: anime.popularity,
            rating: anime.score,
            users: anime.scored_by,
            genres: anime.genres,
            languages: [{english_name : 'Japanese'},{english_name : 'English'}],
            releaseDate: anime.aired.from.slice(0,10),
            runtime: anime.episodes
          };
        });
    } catch (error) {
      console.error('Error fetching top-rated series:', error);
      return [];
    }
  }
});