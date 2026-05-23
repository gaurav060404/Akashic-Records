import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import List from '../components/List';
import SkeletonList from '../components/SkeletonList';
import SkeletonRated from '../components/SkeletonRated';
import Rated from '../components/Rated';
import { useQuery } from '@tanstack/react-query';
import {
  trendingAnimes,
  topRatedAnimes,
} from '../services/animeService.js';

export default function Anime() {

  const {
    data: trendingData,
    isLoading: trendingLoading,
    isError: trendingError,
  } = useQuery({
    queryKey: ['trending-animes'],
    queryFn: trendingAnimes,
  });

  const {
    data: topRatedData,
    isLoading: topRatedLoading,
    isError: topRatedError,
  } = useQuery({
    queryKey: ['top-rated-animes'],
    queryFn: topRatedAnimes,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className='w-full h-full absolute bg-black'>
      <div className='w-full h-20'>
        <Navbar isHomePage={false} hasBg={false} />
      </div>

      {/* Trending Anime */}
      {trendingLoading && <SkeletonList title="Anime" />}

      {trendingData && (
        <List
          title="Anime"
          poster={trendingData}
          isPopular={false}
          isAnime={true}
        />
      )}

      {trendingError && (
        <div className='text-white'>
          Error loading anime data
        </div>
      )}

      {/* Top Rated Anime */}
      {topRatedLoading && (
        <SkeletonRated title="Anime" isRated={true} />
      )}

      {topRatedData && (
        <Rated
          title="Anime"
          isRated={true}
          rated={topRatedData}
        />
      )}

      {topRatedError && (
        <div className='text-white'>
          Error loading top rated anime
        </div>
      )}
    </div>
  );
}
