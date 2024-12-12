import React from 'react'
import Navbar from '../components/Navbar'
import List from '../components/List';
import { useRecoilValueLoadable } from 'recoil';
import { movieSelector } from '../store/store';
import SkeletonList from '../components/SkeletonList';

export default function Movies() {
  const moviesLoadable = useRecoilValueLoadable(movieSelector);

  return (
    <div className='w-full h-full absolute bg-black'>
      <div className='w-full h-20'>
        <Navbar isHomePage={false} hasBg={false}/>
      </div>
      {moviesLoadable.state === 'loading' && <SkeletonList title="Movies" />}
      {moviesLoadable.state === 'hasValue' && (
        <List title="Movies" poster={moviesLoadable.contents} isPopular={false}/>
      )}
      {moviesLoadable.state === 'hasError' && (
        <div className='text-white'>Error loading data</div>
      )}
    </div>
  )
}
