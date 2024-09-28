import React from 'react'

export default function DivComp({text}) {
  return (
    <div className='text-nav text-sm h-7 cursor-pointer hover:text-navhover'>{text}</div>
  )
}
