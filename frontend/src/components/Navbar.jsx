import React from 'react'
import logo from '../assets/logo.png'

export default function Navbar() {
  return (
    <div className='flex justify-evenly items-center text-nav py-4 px-8'>
      <a href="#">
        <img src={logo} alt="Logo" className='w-28 hover:drop-shadow-md'/>
      </a>
      <ul className='flex items-center gap-12 text-base font-custom'>
        <li className='p-3 hover:text-newnav cursor-pointer'>Movies</li>
        <li className='p-3 hover:text-newnav cursor-pointer'>Series</li>
        <li className='p-3 hover:text-newnav cursor-pointer'>Anime</li>
        <li className='p-3 hover:text-newnav cursor-pointer'>Signup</li>
      </ul>
    </div>
  )
}
