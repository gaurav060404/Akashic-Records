import React from 'react';
import Navbar from '../components/Navbar';
import { useLocation } from 'react-router-dom';
import SearchBtn from '../components/SearchBtn';
import Grid from '../components/Grid';

export default function AnimeTrending() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const title = queryParams.get("title") || 'Movie/Anime/Series';

  return (
    <div className='w-full h-full absolute bg-black'>
      <div className='w-full h-20'>
        <Navbar isHomePage={false} />
      </div>
      <div className='flex justify-between items-center px-7'>
      <div className='font-custom3 text-2xl text-white hover:text-blue-300'>Trending {title}</div>
      <SearchBtn />
      </div>
      <Grid /> 
      {/* pass filtered images here */}
    </div>
  );
}
