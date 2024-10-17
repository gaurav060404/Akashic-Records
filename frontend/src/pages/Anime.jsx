import React from 'react';
import Navbar from '../components/Navbar';
import List from '../components/List';
import SkeletonList from '../components/SkeletonList';
import { useRecoilValueLoadable } from 'recoil';
import { animeSelector } from '../store/store';

export default function Anime() {
  const animeLoadable = useRecoilValueLoadable(animeSelector);

  return (
    <div className='w-full h-full absolute bg-black'>
      <div className='w-full h-20'>
        <Navbar isHomePage={false} />
      </div>
      {animeLoadable.state === 'loading' && <SkeletonList />}
      {animeLoadable.state === 'hasValue' && (
        <List title="Anime" poster={animeLoadable.contents} />
      )}
      {animeLoadable.state === 'hasError' && (
        <div className='text-white'>Error loading data</div>
      )}
    </div>
  );
}
