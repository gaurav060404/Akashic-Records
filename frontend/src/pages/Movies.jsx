import React from 'react'
import Navbar from '../components/Navbar'
import List from '../components/List';
import { useRecoilStateLoadable } from 'recoil';
import { movieSelector } from '../store/store';

export default function Movies() {
  const [movies, setMovies] = useRecoilStateLoadable(movieSelector);
  if (movies.state == "loading") {
    return <div>Loading....</div>
  }
  if (movies.state == "hasValue") {
    return (
      <div className='w-full h-full absolute bg-black'>
        <div className='w-full h-20'>
          <Navbar isHomePage={false} />
        </div>
        <List title="Movies" poster={movies.contents} />
      </div>
    )
  }
}
