export const normalizeTMDB = (item) => ({
  id: item.id,
  title: item.title || item.name,
  poster: item.poster_path
    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
    : null,
  overview: item.overview,
  rating: item.vote_average,
  year:
    item.release_date?.split('-')[0] ||
    item.first_air_date?.split('-')[0] ||
    null,
  type: item.media_type || 'movie',
});