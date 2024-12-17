import React from 'react'
import Navbar from '../components/Navbar'
import List from '../components/List';
import { useRecoilValue, useRecoilValueLoadable } from 'recoil';
import { seriesSelector, topRatedSeries } from '../store/store';
import SkeletonList from '../components/SkeletonList';
import Rated from '../components/Rated';

export default function Series() {
  const seriesLoadable = useRecoilValueLoadable(seriesSelector);
  const ratedSeries = useRecoilValueLoadable(topRatedSeries);

  return (
    <div className='w-full h-full absolute bg-black'>
      <div className='w-full h-20'>
        <Navbar isHomePage={false} hasBg={false}/>
      </div>
      {seriesLoadable.state === 'loading' && <SkeletonList title="Series"/>}
      {seriesLoadable.state === 'hasValue' && (
        <List title="Series" poster={seriesLoadable.contents} isPopular={false}/>
      )}
      {seriesLoadable.state === 'hasError' && (
        <div className='text-white'>Error loading data</div>
      )}
      {ratedSeries.state === 'loading' && <div>Loading....</div>}
      {ratedSeries.state === 'hasValue' && (
        <Rated title="Series" isRated={true} rated={ratedSeries.contents}/>
      )}
      {ratedSeries.state === 'hasError' && (
        <div className='text-white'>Error loading data</div>
      )}
    </div>
  )

}
