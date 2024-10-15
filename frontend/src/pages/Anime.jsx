import React, { useEffect ,useState } from 'react'
import Navbar from '../components/Navbar'
import List from '../components/List';
import axios from 'axios';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { animeState } from '../store/store';

export default function Anime() {
  const anime = useRecoilValue(animeState);
  const setAnime = useSetRecoilState(animeState);

  useEffect(()=>{
    async function getPoster() {
      try {
      //animes 
      const animeResult = await axios.get("https://api.themoviedb.org/3/trending/tv/week",{
        params : {
          api_key : import.meta.env.VITE_SECRET_KEY
        }
      });
      const animeData = animeResult.data;
      const filteredAnime = animeData.results.filter((anime)=>{
        return (anime.original_language === "ja" && !anime.adult);
      });
      setAnime(filteredAnime.map((anime) => {
        return {posterPath  : anime.poster_path,posterName : anime.name};
      }));
      
    }
   catch (error) {
    console.error('Error fetching data:', error);
  }
}
  getPoster();
  },[]);
  return (
    <div className='w-full h-full absolute bg-black'>
      <div className='w-full h-20'>
         <Navbar isHomePage={false}/>
      </div>
      <List title="Anime" poster={anime}/>
    </div>
  )
}
