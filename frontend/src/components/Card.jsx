import React from 'react'
import { redirect, useNavigate } from 'react-router-dom';

export default function Card({title,id,posterPath,posterName,isRated}) {
  const navigate = useNavigate();
  console.log(title);
    
  function handleOnClick(){
    console.log("Clicked "+ id );
    const encodedPosterName = encodeURIComponent(posterName);
    
    navigate(`/${title || "trending"}/${isRated ? "rated" : "trending"}/${id}/${encodedPosterName}`);
  }
  return (
    <div className='h-full w-48 bg-black flex-row justify-center items-center pt-4'>
      <div className='w-full h-full flex-row justify-center items-center group'>
        <div className='bg-white h-5/6 rounded-sm overflow-hidden' onClick={handleOnClick}>
          <img src={`https://image.tmdb.org/t/p/w220_and_h330_face${posterPath}`} alt={posterName} className='object-cover w-full h-full hover:border cursor-pointer' />
        </div>
        <p className='text-white font-custom4 text-xs text-center py-5 group-hover:text-blue-400 cursor-pointer'>{posterName}</p>
      </div>
    </div>
  )
}

