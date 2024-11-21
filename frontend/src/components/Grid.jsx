import React from 'react';

export default function Grid() {
  return (
    <div className='pl-10 h-full bg-black m-auto grid grid-cols-5 gap-4'>
      <CardGrid posterName={"Despicables"} />
      <CardGrid posterName={"Despicables"} />
      <CardGrid posterName={"Despicables"} />
      <CardGrid posterName={"Despicables"} />
      <CardGrid posterName={"Despicables"} />
      <CardGrid posterName={"Despicables"} />
      <CardGrid posterName={"Despicables"} />
      <CardGrid posterName={"Despicables"} />
      <CardGrid posterName={"Despicables"} />
      <CardGrid posterName={"Despicables"} />
    </div>
  );
}

function CardGrid({ posterName }) {
  return (
    <div className='h-80 w-48 bg-black flex flex-col justify-center items-center pt-8'>
      <div className='w-full h-full  flex flex-col justify-center items-center group'>
        <div className='bg-white h-5/6 w-full rounded-sm overflow-hidden'>
          <img
            src={`https://image.tmdb.org/t/p/original/xlkclSE4aq7r3JsFIJRgs21zUew.jpg`}
            alt={posterName}
            className='object-cover w-full h-full hover:border cursor-pointer'
          />
        </div>
        <p className='text-white font-custom4 text-xs text-center py-5 group-hover:text-blue-400 cursor-pointer'>{posterName}</p>
      </div>
    </div>
  );
}