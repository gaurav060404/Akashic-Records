import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SkeletonList = () => {
  return (
    <div className='bg-black h-96 flex-row'>
      <div className='w-full text-white flex justify-between items-center px-24 pt-4'>
        <Skeleton width={200} height={30} />
        <Skeleton width={100} height={20} />
      </div>
      <div className='bg-black h-80 flex justify-evenly'>
        {Array(5).fill().map((_, index) => (
          <div key={index} className='w-1/5 p-2'>
            <Skeleton height={300} />
            <Skeleton height={20} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonList;