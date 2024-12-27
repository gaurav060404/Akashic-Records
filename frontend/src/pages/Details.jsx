import React from 'react'
import { useRecoilValue } from 'recoil'
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import returnState from '../utils/state';

export default function Details() {
  const { title, id, category } = useParams();
  const state = returnState(title, category);
  const posters = useRecoilValue(state);
  const poster = posters.find(poster => poster.id === parseInt(id));

  // Function to truncate the synopsis to approximately 4 lines
  function truncateToThreeLines(text) {
    const maxLength = 400; // Approximate character limit for 4 lines

    if (text.length <= maxLength) {
      return text; // If the text is already short, return it as is
    }

    // Find the nearest period within the maxLength to end the synopsis gracefully
    const truncated = text.slice(0, maxLength);
    const lastPeriodIndex = truncated.lastIndexOf('.');
    if (lastPeriodIndex !== -1) {
      return truncated.slice(0, lastPeriodIndex + 1); // Include the period
    }

    // If no period is found within the limit, truncate at maxLength
    return truncated + '...';
  }

  return (
    <div className='h-screen w-full flex flex-col justify-center items-center'>
      <div className='w-full h-20 absolute z-40 top-4'>
        < Navbar isHomePage={false} hasBg={true} />
      </div>
      <div className='relative bg-white h-1/2 w-full z-10'><img src={title == "anime" ? poster.backDropPath : `https://image.tmdb.org/t/p/original${poster.backDropPath}`} alt={poster.posterName} className='object-cover w-full h-full ' /></div>
      <div className='relative bg-custom h-1/2 w-full z-20 shadow-custom'></div>
      <div className='h-1/2 w-1/2 flex justify-start left-36 pb-3 items-center absolute z-30'>
        <div className='h-full w-52 flex-row justify-center items-center mt-12'>
          <div className='w-full h-full flex-row justify-center items-center'>
            <div className='bg-white h-5/6 rounded-sm overflow-hidden shadow-xl'>
              <img src={title === "anime" ? poster.posterPath : `https://image.tmdb.org/t/p/w220_and_h330_face${poster.posterPath}`} alt={poster.posterName} className='object-cover w-full h-full hover:shadow-md' />
            </div>
            <p className='text-center pt-2'>directed by</p>
            <p className='text-center '>Christoph Waltz</p>
          </div>
        </div>
      </div>
      <div className='h-40 w-1/2 top-1/2 mr-12 ml-12 pt-3 absolute z-30 flex flex-col'>
        <p className='font-custom4 text-xl'>{poster.posterName}</p> 
        <p className='text-sm text-wrap pt-2 '>{poster.overview ? truncateToThreeLines(poster.overview) : ""}</p>
      </div>
      <div className='bg-white absolute z-30 h-36 w-full bottom-0'>
      </div>
    </div>
  )
}
