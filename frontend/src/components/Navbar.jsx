import React from 'react'
import logo from '../assets/logo.png'

export default function Navbar() {
  return (
    <div className='flex justify-evenly items-center text-nav py-4 px-8 bg-transparent absolute top-0 left-0 w-full z-10'>
      <a href="#">
        <img src={logo} alt="Logo" className='w-28 hover:drop-shadow-md'/>
      </a>
      <ul className='flex items-center gap-12 text-base font-custom1 p-0'>
        <li className='p-1 hover:text-orange-500 cursor-pointer border-b-2 border-transparent transition-all duration-300 ease-in-out hover:border-b-2 hover:border-current transform hover:scale-105'>Movies</li>
        <li className='p-1 hover:text-orange-500 cursor-pointer border-b-2 border-transparent transition-all duration-300 ease-in-out hover:border-b-2 hover:border-current transform hover:scale-105'>Series</li>
        <li className='p-1 hover:text-orange-500 cursor-pointer border-b-2 border-transparent transition-all duration-300 ease-in-out hover:border-b-2 hover:border-current transform hover:scale-105'>Anime</li>
        <li className='p-1 hover:text-orange-500 cursor-pointer border-b-2 border-transparent transition-all duration-300 ease-in-out hover:border-b-2 hover:border-current transform hover:scale-105'>Signup</li>
      </ul>
    </div>
  )
}
