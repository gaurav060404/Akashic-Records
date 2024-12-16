import React from 'react'

export default function HorizontalCard({ rank , title , posterPath , overview , rating , users}) {
  return (
    <div className='bg-gray-200 h-56 flex justify-start items-center pl-14 rounded-md gap-14 drop-shadow-sm shadow-white' style={{ width: '88%' }}>
      <span className='font-custom1 text-4xl'>#{rank}</span>
      <div className='bg-black h-48 w-36 rounded-md overflow-hidden'>
        <img src={`https://image.tmdb.org/t/p/w220_and_h330_face${posterPath}`} alt={title} className='object-cover w-full h-full hover:border cursor-pointer' />
      </div>
      <div className='bg-transparent h-48 w-96 flex flex-col justify-start'>
        <h2 className='text-black pt-1 text-3xl font-custom1 font-semi-bold'>{title}</h2>
        <p className='pt-2'>{overview}</p>
      </div>
      <div className='text-center pb-5'>
        <div>
          <span className='pr-1'>Genre : </span> 
          <span className='bg-slate-400 p-1 rounded-md'>Crime</span>
          <span className='bg-slate-400 m-3 p-1 rounded-md'>Thriller</span>
        </div>
        <div className='pt-5'>
          <span className='pl-6 pr-1'>Language : </span>
          <span className='bg-slate-400 p-1 rounded-md'>Crime</span>
          <span className='bg-slate-400 m-3 p-1 rounded-md'>Thriller</span>
        </div>
        <p className='pt-5 pr-20'>Popularity : 157</p>
      </div>
      <div className='pl-16'>
        <h1 className='font-custom4 text-6xl font-semibold flex justify-center items-center pb-4'>{rating} </h1>
        <p className='pl-2'>{users} users</p>
      </div>
    </div>
  )
}
