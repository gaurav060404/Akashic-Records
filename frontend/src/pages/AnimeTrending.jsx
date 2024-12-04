import React from 'react';
import Navbar from '../components/Navbar';
import { useLocation } from 'react-router-dom';
import SearchBtn from '../components/SearchBtn';
import { useRecoilState } from 'recoil';
import { search } from '../store/store';
import Grid, { CardGrid } from '../components/Grid';

const images = [
  <CardGrid posterName={"Dispecibales"} />,
  <CardGrid posterName={"Dispecibales"} />,
  <CardGrid posterName={"Dispecibales"} />,
  <CardGrid posterName={"Dispecibales"} />,
  <CardGrid posterName={"Dispecibales"} />,
  <CardGrid posterName={"Dispecibales"} />,
  <CardGrid posterName={"Dispecibales"} />,
  <CardGrid posterName={"Dispecibales"} />,
];

export default function AnimeTrending() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const title = queryParams.get("title") || 'Movie/Anime/Series';

  const [searchItem, setSearchItem] = useRecoilState(search);

  function handleInput(e) {
    const searchItem = e.target.value;
    setSearchItem(searchItem);
  }

  return (
    <div className='w-full h-full absolute bg-black'>
      <div className='w-full h-20'>
        <Navbar isHomePage={false} />
      </div>
      <div className='font-custom3 text-2xl text-white hover:text-blue-300'>Trending {title}</div>
      <SearchBtn handleInput={handleInput} searchItem={searchItem} />
      <Grid />
    </div>
  );
}
