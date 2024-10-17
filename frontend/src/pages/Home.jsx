import React from 'react'
import Carousel from '../components/Carousel'
import List from '../components/List'
import { useRecoilStateLoadable} from 'recoil';
import { allStateSelector } from '../store/store';

export default function Home() {
  const [trending, setTrending] = useRecoilStateLoadable(allStateSelector);

  if (trending.state == "loading") {
    return <div>Loading.........</div>
  }

  if (trending.state == "hasValue") {
    return (
      <div className='w-full h-full absolute'>
        {/* <Navbar/> */}
        <Carousel />
        <div className='text-white bg-black flex items-center justify-center'>
          <p className='py-6 px-3 font-custom4'>The all in one website for Pop Culture.</p>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" />
          </svg>
        </div>
        <List title="" poster={trending.contents} />
      </div>
    )
  }
}
