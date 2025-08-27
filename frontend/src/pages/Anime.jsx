import React from 'react';
import Navbar from '../components/Navbar';
import List from '../components/List';
import SkeletonList from '../components/SkeletonList';
import { useRecoilValueLoadable } from 'recoil';
import { animeSelector, topRatedAnimes } from '../store/store';
import SkeletonRated from '../components/SkeletonRated';
import Rated from '../components/Rated';

export default function Anime() {
  const animeLoadable = useRecoilValueLoadable(animeSelector);
  const ratedAnimes = useRecoilValueLoadable(topRatedAnimes);

  return (
    <div className='w-full h-full absolute bg-black'>
      <div className='w-full h-20'>
        < Navbar isHomePage={false} hasBg={false} />
      </div>
      {animeLoadable.state === 'loading' && <SkeletonList title="Anime" />}
      {animeLoadable.state === 'hasValue' && (
        <List title="Anime" poster={animeLoadable.contents} isPopular={false} />
      )}
      {animeLoadable.state === 'hasError' && (
        <div className='text-white'>Error loading data</div>
      )}
      {ratedAnimes.state === 'loading' && <SkeletonRated title={"Anime"} isRated={true} />}
      {ratedAnimes.state === 'hasValue' && (
        <Rated title="Anime" isRated={true} rated={ratedAnimes.contents} />
      )}
      {ratedAnimes.state === 'hasError' && (
        <div className='text-white'>Error loading data</div>
      )}
    </div>
  );
}
