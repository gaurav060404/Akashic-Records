import React from 'react'
import { useRecoilValue } from 'recoil'
import { posterState } from '../store/store'
import { useParams } from 'react-router-dom';

export default function Details() {
  const posters = useRecoilValue(posterState);
  const {id , posterName} = useParams();
  const poster = posters.find(poster => poster.id === parseInt(id));
  console.log(poster.posterPath);
  
  return (
    <div className='h-screen w-full justify-center items-center'>
      <div className='h-1/2 w-1/2'>
        <div className='h-full w-48 bg-black flex-row justify-center items-center pt-4'>
        <div className='w-full h-full flex-row justify-center items-center group'>
          <div className='bg-white h-5/6 rounded-sm overflow-hidden'>
            <img src={`https://image.tmdb.org/t/p/w220_and_h330_face${poster.posterPath}`} alt={poster.posterName} className='object-cover w-full h-full hover:border cursor-pointer' />
          </div>
          <p className='text-white font-custom4 text-xs text-center py-5 group-hover:text-blue-400 cursor-pointer'>{poster.posterName}</p>
        </div>
      </div>
      </div>
    </div>
  )
}
