import { atom, selector } from "recoil";
import axios from "axios";

// Selector to fetch and process the trending data
export const allStateSelector = selector({
  key: "allStateSelector",
  get: async () => {
    try {
      const seriesResult = await axios.get("https://api.themoviedb.org/3/trending/all/week", {
        params: {
          api_key: import.meta.env.VITE_SECRET_KEY
        }
      });
      const seriesData = seriesResult.data;
      const filteredSeries = seriesData.results.filter((series) => {
        return !(series.original_language === "ja" && !series.adult);
      });
      return filteredSeries.map((trendingSMA) => {
        return { posterPath: trendingSMA.poster_path, posterName: trendingSMA.title ? trendingSMA.title : trendingSMA.name };
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  }
});


export const movieSelector = selector({
  key: "movieSelector",
  get: async function getPoster() {
      try {
          //movies
          const movieResult = await axios.get("https://api.themoviedb.org/3/trending/movie/week", {
              params: {
                  api_key: import.meta.env.VITE_SECRET_KEY
              }
          });
          const movieData = movieResult.data;
          return movieData.results.map((movie) => {
              return { posterPath: movie.poster_path, posterName: movie.title };
          });
      }
      catch (error) {
          console.error('Error fetching data:', error);
          return [];
      }
  }
});

export const seriesSelector = selector({
  key : "seriesSelector",
  get : async function getPoster() {
      try {
        //series
        const seriesResult = await axios.get("https://api.themoviedb.org/3/trending/tv/week", {
          params: {
            api_key: import.meta.env.VITE_SECRET_KEY
          }
        });
        const seriesData = seriesResult.data;
        const filteredSeries = seriesData.results.filter((series) => {
          return !(series.original_language === "ja" && !series.adult);
        });
        return filteredSeries.map((series) => {
          return { posterPath: series.poster_path, posterName: series.name };
        });
      }
      catch (error) {
        console.error('Error fetching data:', error);
        return [];
      }
    }
});

export const animeSelector = selector({
  key : "animeSelector",
  get : async function getPoster() {
      try {
      //animes 
      const animeResult = await axios.get("https://api.themoviedb.org/3/trending/tv/week",{
        params : {
          api_key : import.meta.env.VITE_SECRET_KEY
        }
      });
      const animeData = animeResult.data;
      const filteredAnime = animeData.results.filter((anime)=>{
        return (anime.original_language === "ja" && !anime.adult);
      });
      return filteredAnime.map((anime) => {
        return {posterPath  : anime.poster_path,posterName : anime.name};
      });
    }
   catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
 }
});

export const search = atom({
    key : 'search',
    default : ''
});

export const filtered = atom({
  key : 'filtered',
  default : []
});