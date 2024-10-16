import React from 'react'
import Navbar from '../components/Navbar'
import List from '../components/List';
import { useRecoilValue } from 'recoil';
import { animeState } from '../store/store';

export default function Anime() {
  const anime = useRecoilValue(animeState);

  return (
    <div className='w-full h-full absolute bg-black'>
      <div className='w-full h-20'>
         <Navbar isHomePage={false}/>
      </div>
      <List title="Anime" poster={anime}/>
    </div>
  )
}
