import { useState, useEffect, useMemo } from 'react';
import Card from './Card';

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export default function List({ title = '', poster = [], isUpcoming, isAnime }) {
  const initial = useMemo(
    () => shuffleArray([...poster]).slice(0, 5),
    [poster]
  );

  const [shuffledPosters, setShuffledPosters] = useState(initial);

  useEffect(() => {
    setShuffledPosters(shuffleArray([...poster]).slice(0, 5));
  }, [poster]);


  return (
    <div className='bg-black h-auto pb-7 flex-row'>
      <div className='w-full text-white flex justify-between items-center px-24 pt-4'>
        <h2 className='font-custom3 text-2xl'>
          {isUpcoming ? 'Upcoming' : 'Trending'} {title}
        </h2>
      </div>
      <div className='bg-black h-80 flex justify-evenly'>
        {shuffledPosters.map((item) => (
          <Card
            key={item.id}
            item={item}
            title={title.toLowerCase()}
            isUpcoming={isUpcoming}
            isAnime={isAnime}
          />
        ))}
      </div>
    </div>
  );
}
