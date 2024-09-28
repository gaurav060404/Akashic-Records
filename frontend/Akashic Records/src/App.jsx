import React from 'react'
import Navbar from './components/Navbar'
import Carousel from './components/Carousel'
import img1 from './assets/img1.jpg'
import img2 from './assets/img2.jpg'
import img3 from './assets/img3.jpg'
import img4 from './assets/img4.jpg'
import blackblurr from './assets/blurr1.png'

const slides = [
  img1, img2, img3, img4
];

export default function App() {
  return (
    <div className='bg-black h-screen flex justify-center m-0 p-0'>
      <div className='relative bg-white max-w-full h-3/4 m-0 p-0'>
      <div className='absolute -top-4 left-0 pl-96 w-full z-10'>
        <Navbar/>
      </div>
        <Carousel>
          {
            slides.map((s,index)=>(
              <img key={index} src={s} alt="" className='w-full h-full object-contain object-center'/>
            ))
          }
        </Carousel>
        <img src={blackblurr} alt="Overlay" className='absolute bottom-0 -inset-x-0 w-full h-full rotate-180 m-0 p-0 pb-8'/>
      </div>
    </div>
  )
}
