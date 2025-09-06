import Navbar from '../components/Navbar'
import List from '../components/List';
import { useRecoilValueLoadable } from 'recoil';
import { movieSelector, topRatedMovies } from '../store/store';
import SkeletonList from '../components/SkeletonList';
import Rated from '../components/Rated';
import SkeletonRated from '../components/SkeletonRated';
import { useEffect } from 'react';

export default function Movies() {
  const moviesLoadable = useRecoilValueLoadable(movieSelector);
  const ratedMovies = useRecoilValueLoadable(topRatedMovies);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className='w-full h-full absolute bg-black'>
      <div className='w-full h-20'>
        <Navbar isHomePage={false} hasBg={false} />
      </div>
      {moviesLoadable.state === 'loading' && <SkeletonList title="Movies" />}
      {moviesLoadable.state === 'hasValue' && (
        <List title="Movies" poster={moviesLoadable.contents} />
      )}
      {moviesLoadable.state === 'hasError' && (
        <div className='text-white'>Error loading data</div>
      )}
      {ratedMovies.state == 'loading' && <SkeletonRated title={"Movies"} isRated={true} />}
      {ratedMovies.state == 'hasValue' && <Rated title="Movies" isRated={true} rated={ratedMovies.contents} />}
      {ratedMovies.state === 'hasError' && (
        <div className='text-white'>Error loading data</div>
      )}
    </div>
  )
}
