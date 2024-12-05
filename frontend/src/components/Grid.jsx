import React from 'react';

export default function Grid({images}) {
  return (
    <div className='pl-10 h-full bg-black m-auto grid grid-cols-5 gap-4'>
      {images.map((image,index)=>(
        <CardGrid key={index} image={image} posterName={'Dispecables'}/>
      ))}
    </div>
  );
}

export function CardGrid({posterName,image}) {
  return (
    <div className='h-80 w-48 bg-black flex flex-col justify-center items-center pt-8'>
      <div className='w-full h-full  flex flex-col justify-center items-center group'>
        <div className='bg-white h-5/6 w-full rounded-sm overflow-hidden'>
          <img
            src={image}
            alt={posterName}
            className='object-cover w-full h-full hover:border cursor-pointer'
          />
        </div>
        <p className='text-white font-custom4 text-xs text-center py-5 group-hover:text-blue-400 cursor-pointer'>{posterName}</p>
      </div>
    </div>
  );
}