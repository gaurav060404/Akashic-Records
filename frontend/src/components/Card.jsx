import React from 'react'

export default function Card({posterPath,posterName}) {
  return (
    <div className='h-full w-48 bg-black flex-row justify-center items-center pt-4'>
      <div className='w-full h-full flex-row justify-center items-center group'>
        <div className='bg-white h-5/6 rounded-sm overflow-hidden'>
          <img src={`https://image.tmdb.org/t/p/original${posterPath}`} alt="" className='object-cover w-full h-full hover:border cursor-pointer' />
        </div>
        <p className='text-white font-custom4 text-xs text-center py-5 group-hover:text-blue-400 cursor-pointer'>{posterName}</p>
      </div>
    </div>
  )
}
