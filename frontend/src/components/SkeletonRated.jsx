import React from 'react';
import { Link } from 'react-router-dom';
import SkeletonH from './SkeletonH';

export default function SkeletonRated({title,isRated}) {
  return (
    <div className='bg-black h-full pb-7 flex-col justify-center items-center'>
      <div className='w-full text-white flex justify-between items-center px-24 pt-4'>
        <Link className='font-custom3 text-2xl hover:text-blue-300' to={`/${title.toLowerCase()}`}>{isRated ? "Top Rated" : "Trending"} {title}</Link>
        {title && !isRated && (
          <Link
            to={`/${title.toLowerCase()}/trending?title=${encodeURIComponent(title)}`}
            className='hover:text-blue-400 cursor-pointer font-custom3 text-xs text-slate-300'
          >
            View All
          </Link>
        )}
      </div>
      <div className='bg-black w-full flex flex-col justify-center items-center gap-4 pt-4 pb-5'>
        {
          Array(10).fill().map((_, index) => (
            <SkeletonH key={index}/>
          ))}
      </div>
    </div>
  )
}
