import React from 'react';

export default function Grid({posters}) {
  return (
    <div className='pl-24 h-96 bg-black grid grid-cols-5 gap-4 pt-2'>
      {posters.map((poster,index)=>(
        <CardGrid key={index} posterPath={poster.posterPath} posterName={poster.posterName}/>
      ))}
    </div>
  );
}

export function CardGrid({posterPath,posterName}) {
  return (
    <div className='h-80 w-48 bg-black flex flex-col justify-evenly items-center pt-4'>
      <div className='w-full h-full  flex flex-col justify-center items-center group'>
        <div className='bg-white h-5/6 w-full rounded-sm overflow-hidden'>
          <img
            src={`https://image.tmdb.org/t/p/w220_and_h330_face${posterPath}`}
            alt={posterName}
            className='object-cover w-full h-full hover:border cursor-pointer'
          />
        </div>
        <p className='text-white font-custom4 text-xs text-center py-5 group-hover:text-blue-400 cursor-pointer'>{posterName}</p>
      </div>
    </div>
  );
}