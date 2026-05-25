import { useState } from 'react';
import { useRecoilValueLoadable } from 'recoil';
import { topCreators } from '../services/homePageSeries.js';
import { useQuery } from '@tanstack/react-query';

const TopDirectors = () => {
  const [visibleCount, setVisibleCount] = useState(5);

  const {
    data: topCreatorsData,
    isLoading: topCreatorsLoading,
    isError: topCreatorsError
  } = useQuery({
    queryKey: ["top-creators"],
    queryFn: topCreators
  });

  const handleShowMore = () => {
    setVisibleCount(prev => Math.min(prev + 5, directors.length));
  };

  const handleShowLess = () => {
    setVisibleCount(5);
  };

  if (topCreatorsLoading) {
    return <div className="bg-black text-white py-8 px-4 flex justify-center">
      <p>Loading top directors...</p>
    </div>;
  }

  if (topCreatorsError) {
    console.error('Error loading directors');
    return null;
  }

  const directors = topCreatorsData;
  if (!directors || directors.length === 0) {
    return null;
  }

  return (
    <div className='bg-black h-auto pb-7 flex-row'>
      {/* Header section - matches List component */}
      <div className='w-full text-white flex justify-between items-center px-24 pt-4'>
        <h2 className='font-custom3 text-2xl'>Top Directors</h2>
      </div>

      {/* Content section */}
      <div className='bg-black flex justify-evenly'>
        {topCreatorsData.slice(0, visibleCount).map((director, index) => (
          <div
            key={director.name}
            className="flex flex-col items-center w-52 p-4"
          >
            {director.profile ? (
              <div className="relative w-28 h-28 mb-3 rounded-full overflow-hidden">
                <img
                  src={`https://image.tmdb.org/t/p/w200${director.profile}`}
                  alt={director.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="relative w-28 h-28 mb-3 rounded-full bg-gray-700 flex items-center justify-center">
                <span className="text-3xl font-bold">{index + 1}</span>
              </div>
            )}
            <h3 className="text-xl text-white font-semibold text-center mb-1">{director.name}</h3>
            <div className="text-xs text-gray-400">
              <ul className="list-none text-center">
                <li key={director.id} className="my-1 truncate">
                  {director.works[0].title} ({director.works[0].rating ? director.works[0].rating.toFixed(1) : 'N/A'})
                </li>
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopDirectors;