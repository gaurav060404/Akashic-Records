import { useNavigate } from 'react-router-dom';

export default function Card({ item, title, isUpcoming, isAnime, isManga }) {
  const navigate = useNavigate();

  console.log(title);

  function whatType(title) {
    if (item?.type) return item.type.toLowerCase();
    if (isAnime) return "anime";
    if (isManga) return "manga";

    const lowerTitle = title?.toLowerCase() || "";
    if (lowerTitle.includes("series") || lowerTitle === "tv") return "series";
    if (lowerTitle.includes("movie")) return "movie";
    if (lowerTitle.includes("manga")) return "manga";
    if (lowerTitle.includes("anime")) return "anime";

    return "movie"; // fallback
  }

  function handleOnClick() {
    // Navigate using ID and type
    navigate(`/details/${whatType(title)}/${item.id}`);
  }

  return (
    <div className='h-full w-48 bg-black flex-row justify-center items-center pt-4'>
      <div className='w-full h-full flex-row justify-center items-center group'>
        <div className='bg-white h-5/6 rounded-sm overflow-hitem.idden' onClick={handleOnClick}>
          <img
            src={isAnime || isManga ? item.poster : `https://image.tmdb.org/t/p/w220_and_h330_face${item.poster}`}
            alt={item.poster}
            className='object-cover w-full h-full hover:border cursor-pointer'
          />
        </div>
        <p className='text-white font-custom4 text-xs text-center py-5 group-hover:text-blue-400 cursor-pointer'>
          {item.title}
        </p>
      </div>
    </div>
  );
}

