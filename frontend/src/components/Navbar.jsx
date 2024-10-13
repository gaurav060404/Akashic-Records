import React from 'react'
import logo from '../assets/logo.png'
import { Link } from 'react-router-dom'

export default function Navbar({isHomePage}) {
  return (
    <div className='flex justify-evenly items-center text-nav py-4 px-8 bg-transparent absolute top-0 left-0 w-full z-10'>
      <Link to={'/'}>
        <img src={logo} alt="Logo" className='w-28 hover:drop-shadow-md'/>
      </Link>
      <ul className='flex items-center gap-12 text-base font-custom1 p-0'>
        {!isHomePage && <Link className='p-1 hover:text-orange-500 cursor-pointer border-b-2 border-transparent transition-all duration-300 ease-in-out hover:border-b-2 hover:border-current transform hover:scale-105' to="/">Home</Link>}
        <Link className='p-1 hover:text-orange-500 cursor-pointer border-b-2 border-transparent transition-all duration-300 ease-in-out hover:border-b-2 hover:border-current transform hover:scale-105' to="/movies">Movies</Link>
        <Link className='p-1 hover:text-orange-500 cursor-pointer border-b-2 border-transparent transition-all duration-300 ease-in-out hover:border-b-2 hover:border-current transform hover:scale-105' to="/series">Series</Link>
        <Link className='p-1 hover:text-orange-500 cursor-pointer border-b-2 border-transparent transition-all duration-300 ease-in-out hover:border-b-2 hover:border-current transform hover:scale-105' to="/anime">Anime</Link>
        <Link className='p-1 hover:text-orange-500 cursor-pointer border-b-2 border-transparent transition-all duration-300 ease-in-out hover:border-b-2 hover:border-current transform hover:scale-105' to="/signup">Signup</Link>
      </ul>
    </div>
  )
}
