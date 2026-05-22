import React from 'react';
import crunchyroll from '../assets/crunchyroll.png';
import imdb from '../assets/IMDb.png';
import anilist from '../assets/anilist.png';
import mal from '../assets/mal.png';
import primevideo from '../assets/primevideo.png';
import disney from '../assets/disney.png';
import appletv from '../assets/appletv.png';
import hbo from '../assets/hbo.png';


export default function Companies() {
  return (
    <div className='h-64 w-full flex flex-col justify-center items-center bg-black pb-14'>
      <h2 className='text-3xl text-white font-custom4 pt-16'>Movies , Series & Anime From Your Favourite Website</h2>
      <div className='h-52 w-full flex flex-row justify-center items-center gap-12'>
        <div className='h-20 w-40 pl-4'>
          <a target='_blank' href='https://www.netflix.com/in/'><svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 1024 276.742"><path d="M140.803 258.904c-15.404 2.705-31.079 3.516-47.294 5.676l-49.458-144.856v151.073c-15.404 1.621-29.457 3.783-44.051 5.945v-276.742h41.08l56.212 157.021v-157.021h43.511v258.904zm85.131-157.558c16.757 0 42.431-.811 57.835-.811v43.24c-19.189 0-41.619 0-57.835.811v64.322c25.405-1.621 50.809-3.785 76.482-4.596v41.617l-119.724 9.461v-255.39h119.724v43.241h-76.482v58.105zm237.284-58.104h-44.862v198.908c-14.594 0-29.188 0-43.239.539v-199.447h-44.862v-43.242h132.965l-.002 43.242zm70.266 55.132h59.187v43.24h-59.187v98.104h-42.433v-239.718h120.808v43.241h-78.375v55.133zm148.641 103.507c24.594.539 49.456 2.434 73.51 3.783v42.701c-38.646-2.434-77.293-4.863-116.75-5.676v-242.689h43.24v201.881zm109.994 49.457c13.783.812 28.377 1.623 42.43 3.242v-254.58h-42.43v251.338zm231.881-251.338l-54.863 131.615 54.863 145.127c-16.217-2.162-32.432-5.135-48.648-7.838l-31.078-79.994-31.617 73.51c-15.678-2.705-30.812-3.516-46.484-5.678l55.672-126.75-50.269-129.992h46.482l28.377 72.699 30.27-72.699h47.295z" fill="#d81f26" /></svg></a>
        </div>
        <div className='h-20 w-30 pt-10'>
          <a target='_blank' href="https://www.primevideo.com/"><img src={primevideo} alt="Amazon Prime Video logo" className='h-16' /></a>
        </div>
        <div className='h-20 w-30 flex justify-center items-center pt-12'>
          <a target='_blank' href="https://www.crunchyroll.com/"><img src={crunchyroll} alt="Crunchyroll Logo" className='h-8 w-40' /></a>
        </div>
        <div className='h-20 w-20 flex justify-center items-center pt-12'>
          <a target='_blank' href="https://www.imdb.com/"><img src={imdb} alt="IMDB logo" className='h-8' /></a>
        </div>
        <div className='h-20 w-30 pt-10'>
          <a target='_blank' href="https://anilist.co"><img src={anilist} alt="Anilist logo" className='h-12' /></a>
        </div>
        <div className='h-20 w-30 pt-10'>
          <a target='_blank' href="https://myanimelist.net/"><img src={mal} alt="MyAnimeList logo" className='h-12' /></a>
        </div>
      </div>
      <div className='h-52 w-full flex flex-row justify-center items-center gap-12 pt-2'>
        <div className='h-20 w-30 pt-11'>
          <a target='_blank' href='https://www.hotstar.com/in'><img src={disney} alt="Disney+ Hotstar logo" className='h-12'/></a>
        </div>
        <div className='h-20 w-30 pt-12'>
          <a target='_blank' href='https://tv.apple.com/'><img src={appletv} alt="Apple Tv logo" className='h-10'/></a>
        </div>
        <div className='h-20 w-30 pt-12'>
          <a target='_blank' href='https://www.max.com/'><img src={hbo} alt="HBO Max logo" className='h-10'/></a>
        </div>
      </div>
    </div>
  )
}
