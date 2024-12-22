import React from 'react'
import { useNavigate, useParams } from 'react-router-dom';

export default function Card({title,id,posterPath,posterName,isUpcoming}) {
  const navigate = useNavigate();
  function handleOnClick(){
    const encodedPosterName = encodeURIComponent(posterName);
    navigate(title ? `/${title || "trending"}/${isUpcoming ? "upcoming" : "trending"}/${id}/${encodedPosterName}` : `/trending/${id}/${encodedPosterName}`);
  }
  return (
    <div className='h-full w-48 bg-black flex-row justify-center items-center pt-4'>
      <div className='w-full h-full flex-row justify-center items-center group'>
        <div className='bg-white h-5/6 rounded-sm overflow-hidden' onClick={handleOnClick}>
          <img src={title === "anime" ? posterPath : `https://image.tmdb.org/t/p/w220_and_h330_face${posterPath}`} alt={posterName} className='object-cover w-full h-full hover:border cursor-pointer' />
        </div>
        <p className='text-white font-custom4 text-xs text-center py-5 group-hover:text-blue-400 cursor-pointer'>{posterName}</p>
      </div>
    </div>
  )
}

