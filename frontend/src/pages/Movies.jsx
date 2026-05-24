import Navbar from '../components/Navbar'
import List from '../components/List';
import { useRecoilValueLoadable } from 'recoil';
import SkeletonList from '../components/SkeletonList';
import Rated from '../components/Rated';
import SkeletonRated from '../components/SkeletonRated';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { trendingMovies, topRatedMovies } from '../services/movieService.js';

export default function Movies() {

  const {
    data: trendingData,
    isLoading: trendingLoading,
    isError: trendingError
  } = useQuery({
    queryKey: ["trending-movies"],
    queryFn: trendingMovies
  });

  const {
    data: topRatedData,
    isLoading: topRatedLoading,
    isError: topRatedError
  } = useQuery({
    queryKey: ["top-rated-movies"],
    queryFn: topRatedMovies
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className='w-full h-full absolute bg-black'>
      <div className='w-full h-20'>
        <Navbar isHomePage={false} hasBg={false} />
      </div>
      {trendingLoading && <SkeletonList title="Movies" />}
      {trendingData && (
        <List title="Movies" poster={trendingData} />
      )}
      {trendingError && (
        <div className='text-white'>Error loading data</div>
      )}
      {topRatedLoading && <SkeletonRated title={"Movies"} isRated={true} />}
      {topRatedData && <Rated title="Movies" isRated={true} rated={topRatedData} />}
      {topRatedError && (
        <div className='text-white'>Error loading data</div>
      )}
    </div>
  )
}
