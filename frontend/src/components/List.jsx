import React from 'react'
import Card from './Card'
import { Link } from 'react-router-dom'

export default function List({title}) {
  return (
    <div className='bg-black h-96 flex-row'>
        <div className='w-full text-white flex justify-between items-center px-24 pt-4'>
          <p>Trending {title}</p>
          <Link to={`/${title.toLowerCase()}`} className='hover:text-blue-400 cursor-pointer'>View All</Link></div>
        <div className='bg-black h-80 flex justify-evenly'>
        <Card/>
        <Card/>
        <Card/>
        <Card/>
        <Card/>
        </div>
    </div>
  )
}
