import React from 'react'

export default function HorizontalCard({ rank , title , posterPath , overview , rating , users, popularity , genres , languages , releaseDate ,runtime}) {
  let popular = popularity.toString().slice(0,3);
  console.log(popular[2]);
  if(popular[2] === "."){
    popular = popular.slice(0,2);
  }
  
  return (
    <div className='bg-gray-200 h-56 flex justify-start items-center pl-14 rounded-md gap-14 drop-shadow-sm shadow-white' style={{ width: '88%' }}>
      <span className='font-custom1 text-4xl'>#{rank}</span>
      <div className='bg-black h-48 w-36 rounded-md overflow-hidden'>
        <img src={`https://image.tmdb.org/t/p/w220_and_h330_face${posterPath}`} alt={title} className='object-cover w-full h-full hover:border border-black cursor-pointer' />
      </div>
      <div className='bg-transparent h-48 w-96 flex flex-col justify-start'>
        <h2 className='text-black text-3xl font-custom1 font-semi-bold'>{title}</h2>
        <p className='text-md'>{overview}</p>
      </div>
      <div className='flex flex-col justify-start pt-3 pb-2 w-64'>
        <div>
          <span className='pr-1'>Genre : </span> 
          <span className='bg-slate-400 p-1 rounded-md'>{(genres[0]?.name).split('&')[0].trim()}</span>
          {genres[1]?.name &&<span className='bg-slate-400 m-3 p-1 rounded-md'>{(genres[1]?.name).split('&')[0].trim()}</span>}
        </div>
        <div className='pt-4'>
          <span className='pr-1'>Language : </span>
          <span className='bg-slate-400 p-1 rounded-md'>{languages[0]?.english_name}</span>
          { languages[1]?.english_name && <span className='bg-slate-400 m-3 p-1 rounded-md'>{languages[1]?.english_name}</span>}
        </div>
        <p className='pt-3 pr-14'>Popularity : {popular}</p>
        <p className='pt-3 pr-14'>Release Date : {releaseDate}</p>
        <p className='pt-3 pr-14'>Episode : {runtime}</p>
      </div>
      <div className='pl-7 flex flex-col justify-center items-center'>
        <h1 className='font-custom4 text-6xl font-semibold pb-4'>{rating.slice(0,3)} </h1>
        <p className='pr-1'>{users}</p>
      </div>
    </div>
  )
}
