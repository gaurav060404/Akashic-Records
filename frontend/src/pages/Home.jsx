import React, { useEffect, useState } from 'react'
import Carousel from '../components/Carousel'
import List from '../components/List'
import axios from 'axios';

export default function Home() {
  const [movies,setMovies] = useState([]);
  const [anime,setAnime] = useState([]);
  const [series,setSeries] = useState([]);
  useEffect(()=>{
      async function getPoster() {
        try {
        //series
        const seriesResult = await axios.get("https://api.themoviedb.org/3/trending/tv/week",{
          params : {
            api_key : import.meta.env.VITE_SECRET_KEY
          }
        });
        const seriesData = seriesResult.data;
        const filteredSeries = seriesData.results.filter((series)=>{
          return !(series.original_language === "ja" && !series.adult);
        });
        setSeries(filteredSeries.map((series) => {
          return {posterPath  : series.poster_path,posterName : series.name};
        }));
      
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

        //movies
        const movieResult = await axios.get("https://api.themoviedb.org/3/trending/movie/week",{
          params : {
            api_key : import.meta.env.VITE_SECRET_KEY
          }
        });
        const movieData = movieResult.data;
        setMovies(movieData.results.map((movie) => {
          return {posterPath  : movie.poster_path,posterName : movie.title};
        }));
        
      }
     catch (error) {
      console.error('Error fetching data:', error);
    }
  }
    getPoster();
  },[]);
  return (
    <div className='w-full h-full absolute'>
      {/* <Navbar/> */}
      <Carousel />
      <div className='text-white bg-black flex items-center justify-center'>
        <p className='py-6 px-3 font-custom4'>The all in one website for Pop Culture.</p>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" />
        </svg>
      </div>
      <List title="Movies" poster={movies}/>
      <List title="Anime" poster={anime}/>
      <List title="Series" poster={series}/>
    </div>
  )
}
