import { atom, selector, selectorFamily } from "recoil";
import axios from "axios";

const date = new Date();
const year = date.getFullYear();
const month = String(date.getMonth() + 1).padStart(2, "0"); // 2-digit month
const day = String(date.getDate()).padStart(2, "0");        // 2-digit day
const formattedDate = `${year}-${month}-${day}`;


// Selector to fetch and process the trending data
export const allStateSelector = selector({
  key: "allStateSelector",
  get: async () => {
    try {
      const result = await axios.get(
        "https://api.themoviedb.org/3/trending/all/week",
        {
          params: {
            api_key: import.meta.env.VITE_SECRET_KEY,
          },
        }
      );

      const data = result.data;

      // Filter out Japanese anime
      const filteredData = data.results.filter((series) => {
        return !(series.original_language === "ja" && !series.adult);
      });

      // Fetch details + trailers + creators for each trending item
      const trendingWithDetails = await Promise.all(
        filteredData.map(async (item) => {
          const type = item.media_type; // "movie" or "tv"

          // Fetch details
          const detailsRes = await axios.get(
            `https://api.themoviedb.org/3/${type}/${item.id}`,
            {
              params: {
                api_key: import.meta.env.VITE_SECRET_KEY,
                language: "en-US",
              },
            }
          );
          const details = detailsRes.data;

          // Fetch credits (directors/creators)
          const creditsRes = await axios.get(
            `https://api.themoviedb.org/3/${type}/${item.id}/credits`,
            {
              params: {
                api_key: import.meta.env.VITE_SECRET_KEY,
              },
            }
          );
          const credits = creditsRes.data;

          // Fetch videos
          const videosRes = await axios.get(
            `https://api.themoviedb.org/3/${type}/${item.id}/videos`,
            {
              params: {
                api_key: import.meta.env.VITE_SECRET_KEY,
                language: "en-US",
              },
            }
          );

          const video = videosRes.data.results.find(
            (v) => v.type === "Trailer" && v.site === "YouTube"
          );

          const trailerUrl = video
            ? `https://www.youtube.com/watch?v=${video.key}`
            : null;

          // Extract director or creators
          let directorsOrCreators = [];
          if (type === "movie") {
            directorsOrCreators = credits.crew
              .filter((member) => member.job === "Director")
              .map((d) => d.name);
          } else if (type === "tv") {
            directorsOrCreators = details.created_by.map((c) => c.name);
          }

          const casts = credits.cast
            ? credits.cast.slice(0, 6)
            : [];

          return {
            id: item.id,
            posterPath: item.poster_path,
            posterName: item.title ? item.title : item.name,
            backDropPath: item.backdrop_path,
            overview: item.overview,
            releaseDate: item.release_date || item.first_air_date,
            rating: item.vote_average,
            users: item.vote_count,
            popularity: item.popularity,
            genres: details.genres || [],
            languages: details.spoken_languages || [],
            runtime: details.runtime || details.episode_run_time?.[0] || "N/A",
            type: type === "movie" ? "Movie" : "Series",
            trailerUrl,
            casts,
            director: directorsOrCreators,
          };
        })
      );

      return trendingWithDetails;
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
      // ✅ Fetch trending movies
      const movieResult = await axios.get(
        "https://api.themoviedb.org/3/trending/movie/week",
        {
          params: {
            api_key: import.meta.env.VITE_SECRET_KEY,
          },
        }
      );

      const moviesData = movieResult.data.results;

      const moviesWithDetails = await Promise.all(
        moviesData.map(async (movie) => {
          // ✅ Fetch credits (for director + cast)
          const creditsRes = await axios.get(
            `https://api.themoviedb.org/3/movie/${movie.id}/credits`,
            {
              params: {
                api_key: import.meta.env.VITE_SECRET_KEY,
              },
            }
          );

          const credits = creditsRes.data;

          // Director
          const credit = credits.crew.find((crew) => crew.job === "Director");
          const director = credit ? credit.name : "Unknown";

          // Cast (top 6)
          const casts = credits.cast
            ? credits.cast.slice(0, 6).map((c) => ({
              name: c.name,
              character: c.character,
              profilePath: c.profile_path,
            }))
            : [];

          // ✅ Fetch details (runtime, genres, languages)
          const detailsRes = await axios.get(
            `https://api.themoviedb.org/3/movie/${movie.id}`,
            {
              params: {
                api_key: import.meta.env.VITE_SECRET_KEY,
                language: "en-US",
              },
            }
          );

          const details = detailsRes.data;

          // ✅ Fetch videos (for YouTube trailer)
          const videosRes = await axios.get(
            `https://api.themoviedb.org/3/movie/${movie.id}/videos`,
            {
              params: {
                api_key: import.meta.env.VITE_SECRET_KEY,
                language: "en-US",
              },
            }
          );

          const video = videosRes.data.results.find(
            (v) => v.type === "Trailer" && v.site === "YouTube"
          );

          const trailerUrl = video
            ? `https://www.youtube.com/watch?v=${video.key}`
            : null;

          // ✅ Return structured data
          return {
            id: movie.id,
            posterPath: movie.poster_path,
            posterName: movie.title,
            backDropPath: movie.backdrop_path,
            overview: movie.overview,
            rating: movie.vote_average,
            users: movie.vote_count,
            releaseDate: movie.release_date,
            popularity: movie.popularity,
            director,
            casts, // ✅ Added cast info
            runtime: details.runtime,
            genres: details.genres.map((g) => g.name),
            languages: details.spoken_languages.map((l) => l.english_name),
            trailerUrl,
          };
        })
      );

      return moviesWithDetails;
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
      const seriesResult = await axios.get(
        "https://api.themoviedb.org/3/trending/tv/week",
        {
          params: {
            api_key: import.meta.env.VITE_SECRET_KEY,
          },
        }
      );

      const seriesData = seriesResult.data;

      // Filter out Japanese anime
      const filteredSeriesWithDetails = seriesData.results.filter(
        (series) => !(series.original_language === "ja" && !series.adult)
      );

      const seriesWithDetails = await Promise.all(
        filteredSeriesWithDetails.map(async (series) => {
          // Details
          const res = await axios.get(
            `https://api.themoviedb.org/3/tv/${series.id}`,
            {
              params: { api_key: import.meta.env.VITE_SECRET_KEY },
            }
          );
          const detail = res.data;

          // Credits (for cast)
          const creditsRes = await axios.get(
            `https://api.themoviedb.org/3/tv/${series.id}/credits`,
            {
              params: { api_key: import.meta.env.VITE_SECRET_KEY },
            }
          );
          const credits = creditsRes.data;

          const casts = credits.cast ? credits.cast.slice(0, 6) : [];

          console.log(casts);

          // Trailer
          const videosRes = await axios.get(
            `https://api.themoviedb.org/3/tv/${series.id}/videos`,
            {
              params: {
                api_key: import.meta.env.VITE_SECRET_KEY,
                language: "en-US",
              },
            }
          );

          const video = videosRes.data.results.find(
            (v) => v.type === "Trailer" && v.site === "YouTube"
          );

          const trailerUrl = video
            ? `https://www.youtube.com/watch?v=${video.key}`
            : null;

          return {
            id: series.id,
            title: series.name,
            posterName: series.name,
            posterPath: series.poster_path,
            backDropPath: series.backdrop_path,
            overview: series.overview,
            popularity: series.popularity,
            rating: series.vote_average,
            users: series.vote_count,
            genres: detail.genres.map((g) => g.name),
            languages: detail.languages, // fixed
            releaseDate: series.first_air_date,
            runtime: detail.episode_run_time?.[0] || null, // fixed
            totalEpisodes: detail.number_of_episodes,
            seasons: detail.number_of_seasons,
            director: detail.created_by, // renamed for clarity
            networks: detail.networks.map((n) => n.name),
            trailerUrl,
            casts, // ✅ added cast members
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
  key: "animeSelector",
  get: async () => {
    try {
      const result = await axios.get("https://api.jikan.moe/v4/seasons/now");
      const animes = result.data.data;

      const enrichedData = await Promise.all(
        animes.map(async (anime) => {
          const releaseDate = anime.aired?.from
            ? anime.aired.from.slice(0, 10)
            : null;

          // 🔥 Fetch relations to calculate total seasons
          let seasonsCount = 1;
          try {
            const relationsRes = await axios.get(
              `https://api.jikan.moe/v4/anime/${anime.mal_id}/relations`
            );
            if (relationsRes.data?.data) {
              const relatedSeasons = relationsRes.data.data.filter((rel) =>
                ["Sequel", "Prequel"].includes(rel.relation)
              );
              seasonsCount = relatedSeasons.length + 1;
            }
          } catch (err) {
            console.warn(`Could not fetch seasons for ${anime.title}`, err);
          }

          // 🎭 Fetch Cast (Voice Actors)
          let cast = [];
          try {
            const charactersRes = await axios.get(
              `https://api.jikan.moe/v4/anime/${anime.mal_id}/characters`
            );
            if (charactersRes.data?.data) {
              cast = charactersRes.data.data.slice(0, 5).map((char) => ({
                character: char.character.name,
                actor:
                  char.voice_actors?.find((va) => va.language === "Japanese")
                    ?.person?.name || "Unknown",
                image: char.character.images?.jpg?.image_url || null,
              }));
            }
          } catch (err) {
            console.warn(`Could not fetch cast for ${anime.title}`, err);
          }

          console.log(cast);

          return {
            id: anime.mal_id,
            posterName: anime.title_english || anime.title,
            posterPath: anime.images.jpg.image_url || null,
            backDropPath:
              anime.trailer?.images?.maximum_image_url ||
              anime.images.jpg.large_image_url ||
              anime.images.jpg.image_url ||
              null,
            overview: anime.synopsis || "No synopsis available.",
            rating: anime.score || null,
            popularity: anime.popularity || null,
            users: anime.scored_by || 0,
            genres: anime.genres?.map((g) => g.name) || [],
            languages: [
              { english_name: "Japanese" },
              { english_name: "English" },
            ],
            releaseDate,
            seasons: seasonsCount,
            episodes: anime.episodes || 0,
            trailerUrl: anime.trailer?.url || null,
            director:
              (anime.studios?.length
                ? anime.studios.map((s) => s.name)[0]
                : anime.producers?.length
                  ? anime.producers.map((p) => p.name)[0]
                  : "Unknown"),
            casts: cast, // ✅ Added cast field
          };
        })
      );

      return enrichedData;
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
      return data.results.map(movie => { return { backDropPath: movie.backdrop_path, title: movie.title } });
    } catch (error) {
      console.error('Error fetching data : ', error);
      return [];
    }
  }
});

export const slides = atom({
  key: 'slides',
  default: 0
});

export const upcomingMovies = selector({
  key: 'upcomingMovies',
  get: async function getUpcomingMovies() {
    try {
      const result = await axios.get(`https://api.themoviedb.org/3/movie/upcoming`, {
        params: {
          api_key: import.meta.env.VITE_SECRET_KEY,
          language: "en-US",
          page: 1
        }
      });

      const moviesData = result.data.results;

      const moviesWithDetails = await Promise.all(
        moviesData.map(async (movie) => {
          // ✅ Fetch credits (for director + cast)
          const creditsRes = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/credits`, {
            params: {
              api_key: import.meta.env.VITE_SECRET_KEY
            }
          });

          const credit = creditsRes.data.crew.find(crew => crew.job === "Director");
          const director = credit ? credit.name : "Unknown";

          // ✅ Fixed cast extraction
          const casts = creditsRes.data.cast
            ? creditsRes.data.cast.slice(0, 6).map((c) => ({
              name: c.name,
              character: c.character,
              profilePath: c.profile_path,
            }))
            : [];


          // ✅ Fetch details (for runtime, genres, languages)
          const detailsRes = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}`, {
            params: {
              api_key: import.meta.env.VITE_SECRET_KEY,
              language: "en-US"
            }
          });

          const details = detailsRes.data;

          // ✅ Fetch videos (for YouTube trailer)
          const videosRes = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/videos`, {
            params: {
              api_key: import.meta.env.VITE_SECRET_KEY,
              language: "en-US"
            }
          });

          const video = videosRes.data.results.find(
            v => v.type === "Trailer" && v.site === "YouTube"
          );

          const trailerUrl = video ? `https://www.youtube.com/watch?v=${video.key}` : null;

          return {
            id: movie.id,
            posterPath: movie.poster_path,
            posterName: movie.title,
            backDropPath: movie.backdrop_path,
            overview: movie.overview,
            rating: movie.vote_average,
            users: movie.vote_count,
            releaseDate: movie.release_date,
            popularity: movie.popularity,
            director,
            runtime: details.runtime,
            genres: details.genres.map(g => g.name),
            languages: details.spoken_languages.map(l => l.english_name),
            casts,
            trailerUrl // ✅ Added YouTube trailer link
          };
        })
      );

      return moviesWithDetails;
    } catch (error) {
      console.error("Error while fetching the movies", error);
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
          const res1 = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}`, {
            params: {
              api_key: import.meta.env.VITE_SECRET_KEY
            }
          });

          const res2 = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/credits`, {
            params: {
              api_key: import.meta.env.VITE_SECRET_KEY
            }
          });

          const detail = res1.data;
          const credit = res2.data.crew.find(crew => crew.job === "Director");

          const casts = res2.data.cast
            ? res2.data.cast.slice(0, 6).map((c) => ({
                name: c.name,
                character: c.character,
                profilePath: c.profile_path,
              }))
            : [];

          const videosRes = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/videos`, {
            params: {
              api_key: import.meta.env.VITE_SECRET_KEY,
              language: "en-US"
            }
          });

          const video = videosRes.data.results.find(
            v => v.type === "Trailer" && v.site === "YouTube"
          );

          const trailerUrl = video ? `https://www.youtube.com/watch?v=${video.key}` : null;

          return {
            id: movie.id,
            title: movie.title,
            posterName: movie.title,
            posterPath: movie.poster_path,
            backDropPath: movie.backdrop_path,
            overview: movie.overview,
            popularity: movie.popularity,
            rating: movie.vote_average,
            users: movie.vote_count,
            genres: detail.genres,
            languages: detail.spoken_languages,
            releaseDate: movie.release_date,
            runtime: detail.runtime,
            director: credit.name,
            trailerUrl,
            casts,
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
        return series.origin_country[0] !== "JP" && !series.isAdult;
      });

      const seriesWithDetails = await Promise.all(
        filteredSeriesWithDetails.map(async (series) => {
          // ✅ Get main detail
          const res = await axios.get(`https://api.themoviedb.org/3/tv/${series.id}`, {
            params: {
              api_key: import.meta.env.VITE_SECRET_KEY
            }
          });
          const detail = res.data;

          // ✅ Get credits (for cast)
          const creditsRes = await axios.get(`https://api.themoviedb.org/3/tv/${series.id}/credits`, {
            params: {
              api_key: import.meta.env.VITE_SECRET_KEY
            }
          });

          const casts = creditsRes.data.cast
            ? creditsRes.data.cast.slice(0, 6).map((c) => ({
                name: c.name,
                character: c.character,
                profilePath: c.profile_path,
              }))
            : [];

          // ✅ Get trailer
          const videosRes = await axios.get(`https://api.themoviedb.org/3/tv/${series.id}/videos`, {
            params: {
              api_key: import.meta.env.VITE_SECRET_KEY,
              language: "en-US"
            }
          });

          const video = videosRes.data.results.find(
            v => v.type === "Trailer" && v.site === "YouTube"
          );
          const trailerUrl = video ? `https://www.youtube.com/watch?v=${video.key}` : null;

          return {
            id: series.id,
            title: series.name,
            posterName: series.name,
            posterPath: series.poster_path,
            backDropPath: series.backdrop_path,
            overview: series.overview,
            popularity: series.popularity,
            rating: series.vote_average,
            users: series.vote_count,
            genres: detail.genres,
            languages: detail.spoken_languages,
            releaseDate: series.first_air_date,
            runtime: detail.episode_run_time[0] || null, // ✅ Correct runtime
            seasons: detail.number_of_seasons,
            director: detail.created_by?.map(c => c.name).join(", ") || "N/A", // ✅ Created by instead of director
            networks: detail.networks,
            trailerUrl,
            casts // ✅ Added casts
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

export const upcomingSeries = selector({
  key: "upcomingSeries",
  get: async () => {
    try {
      const result = await axios.get(
        `https://api.themoviedb.org/3/discover/tv?language=en-US&page=1&sort_by=popularity.desc&first_air_date.gte=${formattedDate}`,
        {
          params: {
            api_key: import.meta.env.VITE_SECRET_KEY,
          },
        }
      );

      const upcomingSeriesData = result.data.results.map((series) => ({
        id: series.id,
        posterPath: series.poster_path,
        posterName: series.name,
        backDropPath: series.backdrop_path,
        overview: series.overview,
        ratings: series.vote_average,
        popularity: series.popularity,
        releaseDate: series.first_air_date,
      }));

      return await Promise.all(
        upcomingSeriesData.map(async (series) => {
          // 1️⃣ Fetch details for creators
          const detailsRes = await axios.get(
            `https://api.themoviedb.org/3/tv/${series.id}`,
            {
              params: {
                api_key: import.meta.env.VITE_SECRET_KEY,
                language: "en-US",
              },
            }
          );
          const details = detailsRes.data;
          const creators = details.created_by?.map((c) => c.name) || [];

          const creditsRes = await axios.get(`https://api.themoviedb.org/3/tv/${series.id}/credits`, {
            params: {
              api_key: import.meta.env.VITE_SECRET_KEY
            }
          });

          const casts = creditsRes.data.cast
            ? creditsRes.data.cast.slice(0, 6).map((c) => ({
                name: c.name,
                character: c.character,
                profilePath: c.profile_path,
              }))
            : [];

          // 2️⃣ Fetch trailer (YouTube key)
          const trailerRes = await axios.get(
            `https://api.themoviedb.org/3/tv/${series.id}/videos`,
            {
              params: {
                api_key: import.meta.env.VITE_SECRET_KEY,
                language: "en-US",
              },
            }
          );
          const trailerData = trailerRes.data.results.find(
            (video) => video.type === "Trailer" && video.site === "YouTube"
          );

          return {
            ...series,
            director: creators.length > 0 ? creators[0] : ["Unknown"],
            trailerUrl: trailerData
              ? `https://www.youtube.com/watch?v=${trailerData.key}`
              : null,
            casts,
          };
        })
      );
    } catch (error) {
      console.error("Error fetching the upcoming series data:", error);
      return [];
    }
  },
});

export const upcomingAnimes = selector({
  key: "upcomingAnimes",
  get: async () => {
    try {
      const result = await axios.get(
        "https://api.jikan.moe/v4/seasons/upcoming?sfw&page=1"
      );
      const upcomingAnimesData = result.data.data;

      // Filter only TV anime & sort by popularity
      const filteredUpcomingAnimes = upcomingAnimesData
        .filter((anime) => anime.type === "TV")
        .sort((a, b) => a.popularity - b.popularity);

      // ✅ Wrap map in Promise.all
      const enrichedData = await Promise.all(
        filteredUpcomingAnimes.map(async (anime) => {
          const releaseDate = anime.aired?.prop?.from
            ? `${anime.aired.prop.from.year}-${String(
                anime.aired.prop.from.month
              ).padStart(2, "0")}-${String(anime.aired.prop.from.day).padStart(
                2,
                "0"
              )}`
            : null;

          // 🎭 Fetch top 5 voice actors/cast
          let casts = [];
          try {
            const castRes = await axios.get(
              `https://api.jikan.moe/v4/anime/${anime.mal_id}/characters`
            );
            if (castRes.data?.data) {
              casts = castRes.data.data
                .slice(0, 5) // only top 5
                .map((c) => ({
                  character: c.character?.name || "Unknown",
                  image: c.character?.images?.jpg?.image_url || null,
                  role: c.role || "Unknown",
                  voiceActor:
                    c.voice_actors?.find((va) => va.language === "Japanese")
                      ?.person?.name ||
                    c.voice_actors?.[0]?.person?.name ||
                    "Unknown",
                }));
            }
          } catch (err) {
            console.warn(`Could not fetch casts for ${anime.title}`, err);
          }

          return {
            id: anime.mal_id,
            posterName: anime.title_english || anime.title,
            posterPath: anime.images.jpg.image_url || null,
            backDropPath:
              anime.images.jpg.large_image_url ||
              anime.images.jpg.image_url ||
              null,
            overview: anime.synopsis || "No synopsis available.",
            ratings: anime.score || null,
            popularity: anime.popularity || null,
            releaseDate,
            trailerUrl: anime.trailer?.url || null,
            director:
              (anime.studios?.length
                ? anime.studios.map((s) => s.name)[0]
                : anime.producers?.length
                ? anime.producers.map((p) => p.name)[0]
                : "Unknown"),
            casts,
          };
        })
      );

      return enrichedData;
    } catch (error) {
      console.error("Error fetching the upcoming animes data", error);
      return [];
    }
  },
});

export const ratedPosterState = atom({
  key: 'ratedPosterState',
  default: []
});

export const topRatedAnimes = selector({
  key: "topRatedAnimes",
  get: async () => {
    try {
      const result = await axios.get("https://api.jikan.moe/v4/top/anime");
      const topRated = result.data.data;

      const enrichedData = await Promise.all(
        topRated.map(async (anime) => {
          const releaseDate = anime.aired?.from
            ? anime.aired.from.slice(0, 10)
            : null;

          // 🔥 Fetch relations to calculate total seasons
          let seasonsCount = 1;
          try {
            const relationsRes = await axios.get(
              `https://api.jikan.moe/v4/anime/${anime.mal_id}/relations`
            );

            if (relationsRes.data?.data) {
              const relatedSeasons = relationsRes.data.data.filter((rel) =>
                ["Sequel", "Prequel"].includes(rel.relation)
              );
              seasonsCount = relatedSeasons.length + 1;
            }
          } catch (err) {
            console.warn(`Could not fetch seasons for ${anime.title}`, err);
          }

          // 🎭 Fetch top 5 voice actors/cast
          let casts = [];
          try {
            const castRes = await axios.get(
              `https://api.jikan.moe/v4/anime/${anime.mal_id}/characters`
            );
            if (castRes.data?.data) {
              casts = castRes.data.data
                .slice(0, 5) // only top 5
                .map((c) => ({
                  character: c.character?.name || "Unknown",
                  image: c.character?.images?.jpg?.image_url || null,
                  role: c.role || "Unknown",
                  voiceActor:
                    c.voice_actors?.find((va) => va.language === "Japanese")
                      ?.person?.name ||
                    c.voice_actors?.[0]?.person?.name ||
                    "Unknown",
                }));
            }
          } catch (err) {
            console.warn(`Could not fetch casts for ${anime.title}`, err);
          }

          return {
            id: anime.mal_id,
            posterName: anime.title_english || anime.title,
            posterPath: anime.images.jpg.image_url || null,
            backDropPath:
              anime.trailer?.images?.maximum_image_url ||
              anime.images.jpg.large_image_url ||
              anime.images.jpg.image_url ||
              null,
            overview: anime.synopsis || "No synopsis available.",
            rating: anime.score || null,
            popularity: anime.popularity || null,
            users: anime.scored_by || 0,
            genres: anime.genres?.map((g) => g.name) || [],
            languages: [
              { english_name: "Japanese" },
              { english_name: "English" },
            ],
            releaseDate,
            seasons: seasonsCount, // ✅ now showing actual total seasons
            episodes: anime.episodes || 0,
            trailerUrl: anime.trailer?.url || null,
            director:
              (anime.studios?.length
                ? anime.studios.map((s) => s.name)[0]
                : anime.producers?.length
                  ? anime.producers.map((p) => p.name)[0]
                  : "Unknown"),
            casts,
          };
        })
      );

      return enrichedData;
    } catch (error) {
      console.error("Error fetching top-rated anime:", error);
      return [];
    }
  },
});

export const slideIndex = atom({
  key: "slideIndex",
  default: 0,
});

export const searchResults = selectorFamily({
  key: "searchResults",
  get: (query) => async () => {
    if (!query || query.trim().length < 2) return [];

    try {
      const [movieRes, seriesRes, animeRes] = await Promise.all([
        axios.get("https://api.themoviedb.org/3/search/movie", {
          params: {
            api_key: import.meta.env.VITE_SECRET_KEY,
            query,
            language: "en-US",
            include_adult: false,
          },
        }),
        axios.get("https://api.themoviedb.org/3/search/tv", {
          params: {
            api_key: import.meta.env.VITE_SECRET_KEY,
            query,
            language: "en-US",
          },
        }),
        axios.get(`https://api.jikan.moe/v4/anime`, {
          params: { q: query, sfw: true, limit: 5 },
        }),
      ]);

      // 🔥 Enrich Movies
      const movies = await Promise.all(
        movieRes.data.results.map(async (m) => {
          try {
            const [detailsRes, creditsRes, videosRes] = await Promise.all([
              axios.get(`https://api.themoviedb.org/3/movie/${m.id}`, {
                params: { api_key: import.meta.env.VITE_SECRET_KEY, language: "en-US" },
              }),
              axios.get(`https://api.themoviedb.org/3/movie/${m.id}/credits`, {
                params: { api_key: import.meta.env.VITE_SECRET_KEY },
              }),
              axios.get(`https://api.themoviedb.org/3/movie/${m.id}/videos`, {
                params: { api_key: import.meta.env.VITE_SECRET_KEY },
              }),
            ]);

            const details = detailsRes.data;
            const casts = creditsRes.data.cast.slice(0, 6).map((c) => ({
              name: c.name,
              character: c.character,
              profile_path: c.profile_path ? c.profile_path : null,
            }));

            const trailer = videosRes.data.results.find(
              (v) => v.type === "Trailer" && v.site === "YouTube"
            );

            return {
              id: m.id,
              type: "Movie",
              title: details.title || details.original_title,
              poster: details.poster_path ? details.poster_path : null,
              backdrop: details.backdrop_path ? details.backdrop_path : null,
              overview: details.overview || "No description available.",
              releaseDate: details.release_date || "TBA",
              rating: details.vote_average ?? "N/A",
              popularity: details.popularity,
              users: details.vote_count || 0, // ✅ number of votes
              runtime: details.runtime || 0, // ✅ runtime in minutes
              genres: details.genres?.map((g) => g.name) || [],
              languages:
                details.spoken_languages?.map((l) => ({
                  english_name: l.english_name,
                })) || [],
              director:
                creditsRes.data.crew.find((c) => c.job === "Director")?.name ||
                "Unknown",
              casts,
              trailerUrl: trailer
                ? `https://www.youtube.com/watch?v=${trailer.key}`
                : null,
            };
          } catch (err) {
            console.warn(`Could not fetch details for movie ${m.title}`, err);
            return null;
          }
        })
      );

      // 🔥 Enrich Series
      const series = await Promise.all(
        seriesRes.data.results.map(async (s) => {
          try {
            const [detailsRes, creditsRes, videosRes] = await Promise.all([
              axios.get(`https://api.themoviedb.org/3/tv/${s.id}`, {
                params: { api_key: import.meta.env.VITE_SECRET_KEY, language: "en-US" },
              }),
              axios.get(`https://api.themoviedb.org/3/tv/${s.id}/credits`, {
                params: { api_key: import.meta.env.VITE_SECRET_KEY },
              }),
              axios.get(`https://api.themoviedb.org/3/tv/${s.id}/videos`, {
                params: { api_key: import.meta.env.VITE_SECRET_KEY },
              }),
            ]);

            const details = detailsRes.data;
            const casts = creditsRes.data.cast.slice(0, 6).map((c) => ({
              name: c.name,
              character: c.character,
              profile_path: c.profile_path ? c.profile_path : null,
            }));

            const trailer = videosRes.data.results.find(
              (v) => v.type === "Trailer" && v.site === "YouTube"
            );

            return {
              id: s.id,
              type: "Series",
              title: details.name || details.original_name,
              poster: details.poster_path ? details.poster_path : null,
              backdrop: details.backdrop_path ? details.backdrop_path : null,
              overview: details.overview || "No description available.",
              releaseDate: details.first_air_date || "TBA",
              rating: details.vote_average ?? "N/A",
              popularity: details.popularity,
              users: details.vote_count || 0, // ✅ number of votes
              runtime: details.episode_run_time?.[0] || 0, // ✅ avg runtime per episode
              genres: details.genres?.map((g) => g.name) || [],
              languages:
                details.languages?.map((lang) => ({
                  english_name: lang,
                })) || [],
              director:
                details.created_by?.map((c) => c.name).join(", ") || "Unknown",
              casts,
              trailerUrl: trailer
                ? `https://www.youtube.com/watch?v=${trailer.key}`
                : null,
              seasons: details.number_of_seasons || 1,
              episodes: details.number_of_episodes || 0,
            };
          } catch (err) {
            console.warn(`Could not fetch details for series ${s.name}`, err);
            return null;
          }
        })
      );

      // 🔥 Enrich Anime
      const anime = await Promise.all(
        animeRes.data.data.map(async (a) => {
          try {
            const [detailsRes, castRes] = await Promise.all([
              axios.get(`https://api.jikan.moe/v4/anime/${a.mal_id}/full`),
              axios.get(`https://api.jikan.moe/v4/anime/${a.mal_id}/characters`),
            ]);

            const details = detailsRes.data.data;
            const casts = castRes.data.data.slice(0, 6).map((c) => ({
              character: c.character?.name || "Unknown",
              profile_path: c.character?.images?.jpg?.image_url || null,
              name: c.role || "Unknown",
            }));

            return {
              id: a.mal_id,
              type: "Anime",
              title: details.title_english || details.title,
              poster: details.images?.jpg?.image_url || null,
              backdrop: details.images?.jpg?.large_image_url || null,
              overview: details.synopsis || "No description available.",
              releaseDate: details.aired?.from?.slice(0, 10) || "TBA",
              rating: details.score ?? "N/A",
              popularity: details.popularity || null,
              users: details.members || 0, // ✅ members count
              runtime: details.duration || "Unknown", // ✅ runtime (string like "24 min per ep")
              genres: details.genres?.map((g) => g.name) || [],
              languages: [{ english_name: "Japanese" }, { english_name: "English" }],
              director:
                (details.studios?.length
                  ? details.studios.map((s) => s.name)[0]
                  : details.producers?.length
                  ? details.producers.map((p) => p.name)[0]
                  : "Unknown"),
              casts,
              episodes: details.episodes || 0,
              seasons: details.season || "Unknown",
              trailerUrl: details.trailer?.url || null,
            };
          } catch (err) {
            console.warn(`Could not fetch details for anime ${a.title}`, err);
            return null;
          }
        })
      );

      console.log(anime);

      // Merge all
      const combined = [...movies, ...series, ...anime].filter(Boolean);

      // Sort by release date (fallback: rating)
      combined.sort((a, b) => {
        const dateA = new Date(a.releaseDate || 0).getTime();
        const dateB = new Date(b.releaseDate || 0).getTime();

        if (isNaN(dateA) && isNaN(dateB)) {
          return (b.rating || 0) - (a.rating || 0);
        }
        return dateB - dateA;
      });

      return combined;
    } catch (err) {
      console.error("Search failed:", err);
      return [];
    }
  },
});

export const watchlistState = atom({
  key: "watchlistState",
  default: [],
});


