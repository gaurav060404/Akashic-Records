import React from 'react';
import Navbar from '../components/Navbar';
import { useLocation } from 'react-router-dom';
import SearchBtn from '../components/SearchBtn';
import { useRecoilState } from 'recoil';
import { filtered, search } from '../store/store';
import Grid from '../components/Grid';

const images = [
  `https://image.tmdb.org/t/p/original/xlkclSE4aq7r3JsFIJRgs21zUew.jpg`,
  `https://image.tmdb.org/t/p/original/xlkclSE4aq7r3JsFIJRgs21zUew.jpg`,
  `https://image.tmdb.org/t/p/original/xlkclSE4aq7r3JsFIJRgs21zUew.jpg`,
  `https://image.tmdb.org/t/p/original/xlkclSE4aq7r3JsFIJRgs21zUew.jpg`,
  `https://image.tmdb.org/t/p/original/xlkclSE4aq7r3JsFIJRgs21zUew.jpg`,
  `https://image.tmdb.org/t/p/original/xlkclSE4aq7r3JsFIJRgs21zUew.jpg`,
  `https://image.tmdb.org/t/p/original/xlkclSE4aq7r3JsFIJRgs21zUew.jpg`,
  `https://image.tmdb.org/t/p/original/xlkclSE4aq7r3JsFIJRgs21zUew.jpg`
];

export default function AnimeTrending() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const title = queryParams.get("title") || 'Movie/Anime/Series';

  const [searchItem, setSearchItem] = useRecoilState(search);
  const [filteredImages,setFilteredImages] = useRecoilState(filtered);

  function handleInput(e) {
    const searchItem = e.target.value;
    setSearchItem(searchItem);

    const filteredItems =  images.filter((image)=>
      image.posterName === searchItem
    );
    setFilteredImages(filteredItems);
  }

  return (
    <div className='w-full h-full absolute bg-black'>
      <div className='w-full h-20'>
        <Navbar isHomePage={false} />
      </div>
      <div className='flex justify-between items-center px-7'>
      <div className='font-custom3 text-2xl text-white hover:text-blue-300'>Trending {title}</div>
      <SearchBtn handleInput={handleInput} searchItem={searchItem} />
      </div>
      <Grid images={images} /> 
      {/* pass filtered images here */}
    </div>
  );
}
