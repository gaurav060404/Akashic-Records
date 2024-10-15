import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import List from '../components/List';
import axios from 'axios';

export default function Series() {
  const [series, setSeries] = useState([]);

  useEffect(() => {
    async function getPoster() {
      try {
        //series
        const seriesResult = await axios.get("https://api.themoviedb.org/3/trending/tv/week", {
          params: {
            api_key: import.meta.env.VITE_SECRET_KEY
          }
        });
        const seriesData = seriesResult.data;
        const filteredSeries = seriesData.results.filter((series) => {
          return !(series.original_language === "ja" && !series.adult);
        });
        setSeries(filteredSeries.map((series) => {
          return { posterPath: series.poster_path, posterName: series.name };
        }));
      }
      catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    getPoster();
  }, []);
  return (
    <div className='w-full h-full absolute bg-black'>
      <div className='w-full h-20'>
        <Navbar isHomePage={false} />
      </div>
      <List title="Series" poster={series} />
    </div>
  )
}
