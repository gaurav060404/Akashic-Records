import { useNavigate } from 'react-router-dom';

export default function Card({ item, title, isUpcoming, isAnime }) {
  const navigate = useNavigate();

  function handleOnClick() {
    // Pass the card data using the `state` property
    navigate(`/details/${item.id}`, {
      state: {
        poster: {
          id:item.id,
          posterName:item.posterName,
          posterPath:item.posterPath,
          backDropPath:item.backDropPath,
          overview:item.overview,
          runtime:item.runtime,
          director:item.director[0]?.name || item.director,
          genres:item.genres,
          rating:item.rating,
          seasons:item.seasons,
          releaseDate:item.releaseDate,
          popularity:item.popularity,
          users:item.users,
          trailer:item.trailerUrl,
          type:item.type,
          isUpcoming,
          isAnime,
          credits:item.casts,
          title,
        },
      },
    });
  }

  return (
    <div className='h-full w-48 bg-black flex-row justify-center items-center pt-4'>
      <div className='w-full h-full flex-row justify-center items-center group'>
        <div className='bg-white h-5/6 rounded-sm overflow-hitem.idden' onClick={handleOnClick}>
          <img
            src={isAnime ? item.posterPath : `https://image.tmdb.org/t/p/w220_and_h330_face${item.posterPath}`}
            alt={item.posterName}
            className='object-cover w-full h-full hover:border cursor-pointer'
          />
        </div>
        <p className='text-white font-custom4 text-xs text-center py-5 group-hover:text-blue-400 cursor-pointer'>
          {item.posterName}
        </p>
      </div>
    </div>
  );
}

