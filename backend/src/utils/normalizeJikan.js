export const normalizeJikan = (item, type) => ({
  id: item.mal_id,
  title: item.title,
  poster: item.images?.jpg?.large_image_url || null,
  overview: item.synopsis,
  rating: item.score,
  year: item.year || null,
  type,
});