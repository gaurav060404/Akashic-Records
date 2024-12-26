import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { posterState, shuffledPostersState, upcomingPosterState, shuffledUpcomingPostersState } from '../store/store';
import Card from './Card';

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export default function List({ title, poster = [], isUpcoming }) {
  const shuffled = useMemo(() => shuffleArray([...poster]).slice(0, 5), [poster]);
  const [shuffledPosters, setShuffledPosters] = useRecoilState(isUpcoming ? shuffledUpcomingPostersState : shuffledPostersState);
  const [posters, setPosters] = useRecoilState(isUpcoming ? upcomingPosterState : posterState);

  useEffect(() => {
    setShuffledPosters(shuffled);
  }, [shuffled, setShuffledPosters]);

  useEffect(() => {
    setPosters(poster);
  }, [poster, setPosters]);
  
  return (
    <div className='bg-black h-96 pb-7 flex-row'>
      <div className='w-full text-white flex justify-between items-center px-24 pt-4'>
        <Link className='font-custom3 text-2xl hover:text-blue-300' to={`/${title.toLowerCase()}`}>{isUpcoming ? "Upcoming" : "Trending"} {title}</Link>
        {title && (
          <Link
            to={`/${title.toLowerCase()}/trending?title=${encodeURIComponent(title)}`}
            className='hover:text-blue-400 cursor-pointer font-custom3 text-xs text-slate-300'
          >
            View All
          </Link>
        )}
      </div>
      <div className='bg-black h-80 flex justify-evenly'>
        {shuffledPosters.map((posterData, index) => (
          <Card key={index} title={title.toLowerCase()} id={posterData.id} posterPath={posterData.posterPath} posterName={posterData.posterName} isUpcoming={isUpcoming} />
        ))}
      </div>
    </div>
  );
}
