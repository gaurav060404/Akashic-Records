import React, { useEffect, useState } from 'react'


export default function Carousel({children:slides}) {
  const[currentIndex,setCurrentIndex] = useState(0);

  useEffect(()=>{
    const interval = setInterval(()=>{
      setCurrentIndex((prev)=>(prev+1)%slides.length);
    },15000);

    return () => clearInterval(interval);
  },[slides.length]);

  return (
    <div className='overflow-hidden h-full w-full m-0 p-0 relative'>
      <div className='flex transition-transform duration-500 ease-in-out'
           style={{transform:`translateX(-${currentIndex*100}%)`}}
      >
        {slides.map((slide, index) => (
          <div key={index} className='flex-shrink-0 w-full h-full m-0 p-0'>
            {slide}
          </div>
        ))}
      </div>
    </div>
  )
}
