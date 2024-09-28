import React from 'react'
import DivComp from './DivComp'

export default function Navbar() {
  return (
    <div className='bg-transparent h-12 flex justify-center items-center absolute pt-12 pl-16'>
        <h3 className='pr-20 font-bold text-2xl text-white'>Akashic Records</h3>
        <div className='flex pt-3 justify-evenly w-96'>
        <DivComp text={"Movies"}></DivComp>
        <DivComp text={"Series"}></DivComp>
        <DivComp text={"Anime"}></DivComp>
        <DivComp text={"Register"}></DivComp>
        <DivComp text={"Signin"}></DivComp>
        </div>
    </div>
  )
}
