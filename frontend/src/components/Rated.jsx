import React from 'react'
import { Link } from 'react-router-dom'
import HorizontalCard from './HorizontalCard';

export default function Rated({ rated ,title, isRated }) {
       return (
        <div className='bg-black h-full pb-7 flex-col justify-center items-center'>
            <div className='w-full text-white flex justify-between items-center px-24 pt-4'>
                <Link className='font-custom3 text-2xl hover:text-blue-300' to={`/${title.toLowerCase()}`}>{isRated ? "Top Rated" : "Trending"} {title}</Link>
                {title && !isRated && (
                    <Link
                        to={`/${title.toLowerCase()}/trending?title=${encodeURIComponent(title)}`}
                        className='hover:text-blue-400 cursor-pointer font-custom3 text-xs text-slate-300'
                    >
                        View All
                    </Link>
                )}
            </div>
            <div className='bg-black w-full flex flex-col justify-center items-center gap-4 pt-4 pb-5'>
                {
                    rated.map((data,index)=>
                        <HorizontalCard key={data.id} rank={index+1} id={data.id} title={data.title} posterPath={data.posterPath} overview={data.overview} rating={data.rating.toString()} users={data.users} popularity={data.popularity.toString()} genres={data.genres} languages={data.languages} releaseDate={data.releaseDate} runtime={data.runtime}/>
                    )
                }
            </div>
        </div>
    );
}
