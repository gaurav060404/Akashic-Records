import React from 'react';
import Navbar from '../components/Navbar';
import { Link, useLocation } from 'react-router-dom';
import SearchBtn from '../components/SearchBtn';
import Grid from '../components/Grid';
import { useRecoilValue } from 'recoil';
import { shuffledPostersState } from '../store/store';

export default function AnimeTrending() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const title = queryParams.get("title") || 'Movie/Anime/Series';
  const shuffledPosters = useRecoilValue(shuffledPostersState);
  console.log(title);
  

  return (
    <div className='w-full h-full absolute bg-black'>
      <div className='w-full h-20'>
        <Navbar isHomePage={false} />
      </div>
      {/* <div className='flex justify-between items-center px-10'>
      <div className='font-custom3 text-2xl text-white hover:text-blue-300'>Trending {title}</div>
      <SearchBtn />
      </div> */}
      <div className='w-full text-white flex justify-between items-center px-24 pt-4'>
        <Link className='font-custom3 text-2xl hover:text-blue-300' to={`/${title.toLowerCase()}`}>Trending {title}</Link>
        <SearchBtn />
      </div>
      <Grid posters={shuffledPosters}/>  
    </div>
  );
}
