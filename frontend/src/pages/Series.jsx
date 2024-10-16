import React from 'react'
import Navbar from '../components/Navbar'
import List from '../components/List';
import { useRecoilValue } from 'recoil';
import { seriesState } from '../store/store';

export default function Series() {
  const series = useRecoilValue(seriesState);
  
  return (
    <div className='w-full h-full absolute bg-black'>
      <div className='w-full h-20'>
        <Navbar isHomePage={false} />
      </div>
      <List title="Series" poster={series} />
    </div>
  )
}
