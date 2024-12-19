import React from 'react'
import { useRecoilValue } from 'recoil'
import { posterState, ratedPosterState } from '../store/store'
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Details() {
  const { title,id,category } = useParams();
  const state = category === "trending" ? posterState : ratedPosterState;
  const posters = useRecoilValue(state);
  const poster = posters.find(poster => poster.id === parseInt(id));

  return (
    <div className='h-screen w-full flex flex-col justify-center items-center'>
      <div className='w-full h-20 absolute z-40 top-4'>
        < Navbar isHomePage={false} hasBg={true}/>
      </div>
      <div className='relative bg-white h-1/2 w-full z-10'><img src={title == "anime" ? poster.backDropPath : `https://image.tmdb.org/t/p/original${poster.backDropPath}`} alt={poster.posterName} className='object-cover w-full h-full ' /></div>
      <div className='relative bg-custom h-1/2 w-full z-20 shadow-custom'></div>
      <div className='h-1/2 w-1/2 flex justify-center items-center absolute z-30'>
        <div className='h-full w-52 flex-row justify-center items-center pt-4'>
          <div className='w-full h-full flex-row justify-center items-center group'>
            <div className='bg-white h-5/6 rounded-sm overflow-hidden shadow-xl'>
              <img src={title === "anime" ? poster.posterPath : `https://image.tmdb.org/t/p/w220_and_h330_face${poster.posterPath}`} alt={poster.posterName} className='object-cover w-full h-full hover:shadow-md' />
            </div>
            <p className='font-custom4 text-xs text-center py-5 group-hover:text-blue-400 cursor-pointer'>{poster.posterName}</p>
          </div>
        </div>
      </div>

    </div>
  )
}
