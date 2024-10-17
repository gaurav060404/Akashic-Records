import React from 'react'
import Navbar from '../components/Navbar'
import List from '../components/List';
import { useRecoilStateLoadable } from 'recoil';
import { seriesSelector} from '../store/store';

export default function Series() {
  const [series, setSeries] = useRecoilStateLoadable(seriesSelector);
  if (series.state == "loading") {
    return <div>Loading.........</div>
  }
  if (series.state == "hasValue") {
    return (
      <div className='w-full h-full absolute bg-black'>
        <div className='w-full h-20'>
          <Navbar isHomePage={false} />
        </div>
        <List title="Series" poster={series.contents} />
      </div>
    )
  }
}
