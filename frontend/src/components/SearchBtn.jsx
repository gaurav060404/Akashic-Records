import React from 'react'

export default function SearchBtn({handleInput,searchItem}) {
  return (
    <div className='text-white flex justify-end items-center mr-20'>
      <input type="text" placeholder='Search Here' className='h-8 w-48 pl-3 placeholder:text-gray-200 rounded-sm bg-gray-900 border border-gray-400' />
      
    </div>
  )
}
