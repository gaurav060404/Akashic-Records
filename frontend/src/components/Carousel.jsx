import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Navbar from './Navbar';

export default function Carousel() {
  
  const [slide, setSlide] = useState(0);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlide((prev) => (prev + 1) % images.length);
    }, 12000);

    return () => clearInterval(interval);
  }, [images]);

  useEffect(() => {
    async function fetchImage() {
      try {
        const result = await axios.get(`https://api.themoviedb.org/3/movie/popular`, {
          params: {
            api_key: import.meta.env.VITE_SECRET_KEY
          }
        });
        const data = result.data;
        setImages(data.results.map(movie => movie.backdrop_path));
      } catch (error) {
        console.log('Error fetching data : ', error);
      }
    }
    fetchImage();
    // console.log(images.length);
  }, []);

  return (
    <div className='h-screen w-full relative'>
      <Navbar isHomePage={true}/>
      {images.length > 0 &&
        <img
          src={`https://image.tmdb.org/t/p/original/${images[slide]}`}
          alt={`Carousel ${slide}`}
          className="h-full w-full absolute inset-0 overflow-hidden object-cover bg-center duration-500 bg-blackOverlay "
        />}
      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
      <div className='w-2/3 h-1/3 bottom-0 left-1/4 absolute flex flex-col items-center pt-8 pr-24'>
        <h1 className='font-custom4 text-5xl font-bold pr-40 text-white'>The Records Of Akasha</h1>
        <div className='w-2/3 pt-2 pl-20'>
          <p className='pl-7 text-white'>To Keep All The Records Of Your </p>
          <p className='text-white'>Favourite Movies , TV Shows And Animes.</p>
          <button className='rounded-sm bg-white font-custom4 hover:bg-green-500 hover:text-white cursor-pointer px-3 py-2 ml-24 mt-5 mb-2 border-none border-green-500 duration-300'>Click Here!!!</button>
        </div>
      </div>
    </div>
  )
}
