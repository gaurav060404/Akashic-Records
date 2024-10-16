import React from 'react'
import Navbar from '../components/Navbar'
import List from '../components/List';
import { useRecoilValue} from 'recoil';
import { moviesState } from '../store/store';

export default function Movies() {
  const movies = useRecoilValue(moviesState);
  
  return (
    <div className='w-full h-full absolute bg-black'>
      <div className='w-full h-20'>
         <Navbar isHomePage={false}/>
      </div>
      <List title="Movies" poster={movies}/>
    </div>
  )
}
