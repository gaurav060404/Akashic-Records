import React from 'react'

export default function Card() {
  return (
    <div className='h-full w-48 bg-black flex-row justify-center items-center pt-4'>
      <div className='w-full h-full flex-row justify-center items-center group'>
        <div className='bg-white h-5/6 rounded-sm overflow-hidden'>
          <img src="https://wallpapercave.com/wp/wp6031045.jpg" alt="" className='object-cover w-full h-full hover:border cursor-pointer' />
        </div>
        <p className='text-white font-custom4 text-xs text-center py-4 group-hover:text-orange-200'>Demon Slayer Season 1</p>
      </div>
    </div>
  )
}
