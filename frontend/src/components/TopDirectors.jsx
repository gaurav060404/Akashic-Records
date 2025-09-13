import { useState } from 'react';
import { useRecoilValueLoadable } from 'recoil';
import { topDirectorsSelector } from '../store/store';

const TopDirectors = () => {
  const [visibleCount, setVisibleCount] = useState(5);
  const directorsLoadable = useRecoilValueLoadable(topDirectorsSelector);

  const handleShowMore = () => {
    setVisibleCount(prev => Math.min(prev + 5, directors.length));
  };

  const handleShowLess = () => {
    setVisibleCount(5);
  };

  if (directorsLoadable.state === 'loading') {
    return <div className="bg-black text-white py-8 px-4 flex justify-center">
      <p>Loading top directors...</p>
    </div>;
  }

  if (directorsLoadable.state === 'hasError') {
    console.error('Error loading directors:', directorsLoadable.contents);
    return null;
  }

  const directors = directorsLoadable.contents;
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
        {directors.slice(0, visibleCount).map((director, index) => (
          <div 
            key={director.name} 
            className="flex flex-col items-center w-52 p-4"
          >
            {director.profilePath ? (
              <div className="relative w-28 h-28 mb-3 rounded-full overflow-hidden">
                <img 
                  src={`https://image.tmdb.org/t/p/w200${director.profilePath}`} 
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
                {director.titles.slice(0, 3).map(title => (
                  <li key={title.id} className="my-1 truncate">
                    {title.title} ({title.rating ? title.rating.toFixed(1) : 'N/A'})
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopDirectors;