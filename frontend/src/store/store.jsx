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
          id : trendingSMA.id,
          posterPath: trendingSMA.poster_path,
          posterName: trendingSMA.title ? trendingSMA.title : trendingSMA.name,
          backDropPath : trendingSMA.backdrop_path
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
        return { id : movie.id , 
          posterPath: movie.poster_path, 
          posterName: movie.title ,
          backDropPath : movie.backdrop_path
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
        return { id : series.id , 
          posterPath: series.poster_path,
          posterName: series.name,
          backDropPath : series.backdrop_path
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
        return { id: anime.id ,
          posterPath: anime.poster_path, 
          posterName: anime.name,
          backDropPath : anime.backdrop_path
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
          return { id : anime.id , posterPath: anime.poster_path, posterName: anime.name , backDropPath : anime.backdrop_path};
        });

        for (let i = filteredAnimeData.length ; i < 5; i++) {
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
  key : 'shuffledPostersState',
  default : [],
});

export const posterState = atom({
  key : 'posterState',
  default : [],
});
