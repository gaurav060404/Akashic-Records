import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className='h-screen w-full flex justify-center items-center'>
      <div className='h-2/3 w-1/2 flex flex-col justify-center items-center'>
      <h1 className='font-custom1 text-9xl '>404</h1>
      <h3 className='font-custom1 text-2xl '>Oops! Page Not Found</h3>
      <p className='font-custom1 text-base font-extralight pt-2 pb-4'>Page Not Found? Go Back To The Home Page & Explore</p>
      <Link to='/' className='text-sm text-white font-custom1 font-semibold bg-blue-600 p-2 rounded-md text-center hover:bg-blue-700'>Go To Home Page</Link>
      </div>
    </div>
  )
}
