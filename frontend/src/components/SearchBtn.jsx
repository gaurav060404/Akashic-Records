import React from 'react'

export default function SearchBtn({handleInput,searchItem}) {
  return (
    <div className='text-white flex justify-end items-center mr-20'>
      <input type="text" placeholder='Search Here' className='h-8 w-48 pl-3 placeholder:text-gray-200 rounded-sm bg-gray-900 border border-gray-400' />
      <svg className='pt-1 pl-4 pb-1 cursor-pointer' xmlns="http://www.w3.org/2000/svg" width="29" height="29" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
      </svg>
    </div>
  )
}
