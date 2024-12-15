import React from 'react'

export default function HorizontalCard({rank}) {
  return (
    <div className='bg-white h-56 flex justify-start items-center pl-8' style={{width:'88%'}}> 
        <span className='font-custom1 text-4xl'>#{rank}</span>
    </div>
  )
}
