import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import List from '../components/List';
import axios from 'axios';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { moviesState } from '../store/store';

export default function Movies() {
  const movies = useRecoilValue(moviesState);
  const setMovies = useSetRecoilState(moviesState);

  useEffect(() => {
    async function getPoster() {
      try {
        //movies
        const movieResult = await axios.get("https://api.themoviedb.org/3/trending/movie/week", {
          params: {
            api_key: import.meta.env.VITE_SECRET_KEY
          }
        });
        const movieData = movieResult.data;
        setMovies(movieData.results.map((movie) => {
          return { posterPath: movie.poster_path, posterName: movie.title };
        }));
      }
      catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    getPoster();
  }, []);
  return (
    <div className='w-full h-full absolute bg-black'>
      <div className='w-full h-20'>
         <Navbar isHomePage={false}/>
      </div>
      <List title="Movies" poster={movies}/>
    </div>
  )
}
