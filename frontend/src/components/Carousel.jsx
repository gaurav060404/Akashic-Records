import React, { useState ,useEffect } from 'react'
import Navbar from './Navbar';

export default function Carousel() {
  const url = ['https://images.unsplash.com/photo-1727709350469-5fde916217a8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1727820880806-8da6deef7467?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1705087636671-9dad62ca6acf?q=80&w=1947&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'];

  const [slide,setSlide] = useState(0);

  useEffect(()=>{
    const interval = setInterval(()=>{
      setSlide((prev)=>(prev+1)%url.length);
    },8000);

    return () => clearInterval(interval);
  },[url.length]);

  return (
    <div className='h-screen w-full relative'>
      <Navbar/>
        <img 
        src={url[slide]} 
        alt={`Carousel ${slide}`}
        className='h-full w-full absolute inset-0 overflow-hidden object-cover bg-center duration-500'
        />
    </div>
  )
}
