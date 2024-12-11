import React from 'react'
import Navbar from '../components/Navbar'
import List from '../components/List';
import { useRecoilValueLoadable } from 'recoil';
import { seriesSelector } from '../store/store';
import SkeletonList from '../components/SkeletonList';

export default function Series() {
  const seriesLoadable = useRecoilValueLoadable(seriesSelector);

  return (
    <div className='w-full h-full absolute bg-black'>
      <div className='w-full h-20'>
        <Navbar isHomePage={false} hasBg={false}/>
      </div>
      {seriesLoadable.state === 'loading' && <SkeletonList title="Series"/>}
      {seriesLoadable.state === 'hasValue' && (
        <List title="Series" poster={seriesLoadable.contents}/>
      )}
      {seriesLoadable.state === 'hasError' && (
        <div className='text-white'>Error loading data</div>
      )}
    </div>
  )

}
