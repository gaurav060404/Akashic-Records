import React from 'react'
import { useNavigate } from 'react-router-dom';

export default function HorizontalCard({ id, rank, compName, title, posterPath, overview, rating, users, popularity, genres, languages, releaseDate, runtime }) {
  let popular = popularity.toString().slice(0, 3);
  if (popular[2] === ".") {
    popular = popular.slice(0, 2);
  }

  const navigate = useNavigate();

  function handleOnClick() {
    console.log("Clicked " + id);
    const encodedPosterName = encodeURIComponent(title);

    navigate(`/${compName.toLowerCase()}/rated/${id}/${encodedPosterName}`);
  }

  // Function to truncate the synopsis to approximately 4 lines
  function truncateToFourLines(text) {
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
    <div className='bg-gray-200 h-60 pb-5 flex justify-start items-center pl-14 rounded-md gap-14 drop-shadow-sm shadow-white cursor-pointer hover:border border-black' style={{ width: '88%' }} onClick={handleOnClick}>
      <span className='font-custom1 text-4xl'>#{rank}</span>
      <div className='bg-black mt-5 h-52 w-40 rounded-md drop-shadow-md overflow-hidden'>
        <img src={compName == "Anime" ? posterPath : `https://image.tmdb.org/t/p/w220_and_h330_face${posterPath}`} alt={title} className='object-cover w-full h-full hover:border border-black cursor-pointer' />
      </div>
      <div className='bg-transparent h-48 w-96 flex flex-col justify-start'>
        <h2 className='text-black text-3xl font-custom1 font-semi-bold'>{title}</h2>
        <p className='text-sm pt-2'>{truncateToFourLines(overview)}</p>
      </div>
      <div className='flex flex-col justify-start pt-8 pb-2 w-64'>
        <div>
          <span className='pr-1'>Genre : </span>
          <span className='bg-slate-400 p-1 rounded-md'>{(genres[0]?.name).split('&')[0].trim()}</span>
          {genres[1]?.name && <span className='bg-slate-400 m-3 p-1 rounded-md'>{(genres[1]?.name).split('&')[0].trim()}</span>}
        </div>
        <div className='pt-4'>
          <span className='pr-1'>Language : </span>
          <span className='bg-slate-400 p-1 rounded-md'>{languages[0]?.english_name}</span>
          {languages[1]?.english_name && <span className='bg-slate-400 m-3 p-1 rounded-md'>{languages[1]?.english_name}</span>}
        </div>
        <p className='pt-3 pr-14'>Popularity : {popular}</p>
        <p className='pt-3 pr-14'>Release Date : {releaseDate}</p>
        <p className='pt-3 pr-14'>{compName == "Movies" ? "Runtime" : "Episode"} : {compName == "Movies" ? (runtime / 60).toString().slice(0, 3) + 'h' : (runtime)} </p>
      </div>
      <div className='pl-7 flex flex-col justify-center items-center'>
        <h1 className='font-custom4 text-6xl font-semibold pb-4'>{rating.slice(0, 3)} </h1>
        <p className='pr-1'>{users}</p>
      </div>
    </div>
  )
}
