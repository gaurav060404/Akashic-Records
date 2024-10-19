import React from 'react'
import Navbar from '../components/Navbar'

export default function AnimeTrending() {
    return (
        <div className='w-full h-full absolute bg-black'>
            <div className='w-full h-20'>
                <Navbar isHomePage={false} />
            </div>
        </div>
    )
}
