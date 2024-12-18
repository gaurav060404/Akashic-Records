import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function SkeletonH() {
  return (
    <div className='bg-gray-300 h-56 flex justify-start items-center pl-14 rounded-md gap-14 drop-shadow-sm shadow-white' style={{ width: '88%' }}>
      <span className='font-custom1 text-4xl'><Skeleton width={40} /></span>
      <div className='bg-black h-48 w-36 pb-3 rounded-md overflow-hidden'>
        <Skeleton height={200} width={144}/>
      </div>
      <div className='bg-transparent h-48 w-96 flex flex-col justify-start'>
        <h2 className='text-black text-3xl font-custom1 font-semi-bold'><Skeleton width={200} /></h2>
        <p className='text-md'><Skeleton count={4}/></p>
      </div>
    </div>
  );
}
