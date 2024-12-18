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
          backDropPath: trendingSMA.backdrop_path
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
          backDropPath: movie.backdrop_path
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
      return filteredSeries.map((series) => {
        return {
          id: series.id,
          posterPath: series.poster_path,
          posterName: series.name,
          backDropPath: series.backdrop_path
        };
      });

    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  },
});

export const animeSelector = selector({
  key: "animeSelector",
  get: async function getPoster() {
    try {
      //animes
      const animeResult = await axios.get(
        "https://api.themoviedb.org/3/trending/tv/week",
        {
          params: {
            api_key: import.meta.env.VITE_SECRET_KEY,
          },
        }
      );
      const animeData = animeResult.data;
      const filteredAnime = animeData.results.filter((anime) => {
        return anime.original_language === "ja" && !anime.adult;
      });

      const filteredAnimeData = filteredAnime.map((anime) => {
        return {
          id: anime.id,
          posterPath: anime.poster_path,
          posterName: anime.name,
          backDropPath: anime.backdrop_path
        };
      });

      console.log(filteredAnimeData);

      if (filteredAnimeData.length < 5) {
        const year = new Date().getFullYear();
        const date = new Date().getDate();
        const additionalAnimeResult = await axios.get(
          `https://api.themoviedb.org/3/discover/tv?air_date.lte=${date}&first_air_date_year=${year}&include_adult=false&include_null_first_air_dates=false&language=en-US&page=1&sort_by=popularity.desc&with_origin_country=JP&with_original_language=ja`,
          {
            params: {
              api_key: import.meta.env.VITE_SECRET_KEY,
            },
          }
        );

        const additionalAnimeData = additionalAnimeResult.data.results.filter((anime) => {
          return anime.original_language === 'ja' && !anime.adult;
        }).map((anime) => {
          return { id: anime.id, posterPath: anime.poster_path, posterName: anime.name, backDropPath: anime.backdrop_path };
        });

        for (let i = filteredAnimeData.length; i < 5; i++) {
          filteredAnimeData.push(additionalAnimeData[i]);
        }

        return filteredAnimeData;
      }
      return filteredAnimeData;
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  },
});

export const shuffledPostersState = atom({
  key: 'shuffledPostersState',
  default: [],
});

export const posterState = atom({
  key: 'posterState',
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

export const popularTvShows = selector({
  key: 'popularTv',
  get: async function getPopularTVShows() {
    try {
      const result = await axios.get('https://api.themoviedb.org/3/tv/popular?language=en-US&page=1', {
        params: {
          api_key: import.meta.env.VITE_SECRET_KEY
        }
      });
      const tvShows = result.data;
      return tvShows.results.map((tvShow) => {
        return {
          id: tvShow.id,
          posterPath: tvShow.poster_path,
          posterName: tvShow.name,
          backDropPath: tvShow.backdrop_path
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
            posterPath: movie.poster_path,
            backDropPath : movie.backdrop_path,
            overview: movie.overview,
            popularity: movie.popularity,
            rating: movie.vote_average,
            users: movie.vote_count,
            genres : detail.genres,
            languages: detail.spoken_languages,
            releaseDate : movie.release_date,
            runtime : detail.runtime
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
  key : 'topRatedSeries',
  get :  async function getRatedSeries() {
    try {
      const result = await axios.get('https://api.themoviedb.org/3/tv/top_rated', {
        params: {
          api_key: import.meta.env.VITE_SECRET_KEY
        }
      });
      const topRated = result.data.results;

      console.log(topRated);

      const filteredSeriesWithDetails = topRated.filter((series)=>{
        return series.origin_country[0] !=="JP" && !series.isAdult
      });

      console.log(filteredSeriesWithDetails);

      const seriesWithDetails = await Promise.all(
        filteredSeriesWithDetails.map(async(series) => {
          const res = await axios.get(`https://api.themoviedb.org/3/tv/${series.id}`, {
            params: {
              api_key: import.meta.env.VITE_SECRET_KEY
            }
          });
          const detail = res.data;
          return {
            id: series.id,
            title: series.name,
            posterPath: series.poster_path,
            backDropPath : series.backdrop_path,
            overview: series.overview,
            popularity: series.popularity,
            rating: series.vote_average,
            users: series.vote_count,
            genres : detail.genres,
            languages: detail.spoken_languages,
            releaseDate : series.first_air_date,
            runtime : detail.seasons[0].episode_count
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
  key : 'ratedPosterState',
  default : []
});