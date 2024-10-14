import Card from './Card'
import { Link } from 'react-router-dom'

export default function List({title,poster}) {
  return (
    <div className='bg-black h-96 flex-row'>
        <div className='w-full text-white flex justify-between items-center px-24 pt-4'>
          <Link className='font-custom3 text-2xl hover:text-blue-300' to={`/${title.toLowerCase()}`}>Trending {title}</Link>
          <Link to={`/${title.toLowerCase()}`} className='hover:text-blue-400 cursor-pointer font-custom3 text-xs text-slate-300'>View All</Link></div>
        <div className='bg-black h-80 flex justify-evenly'>
        {
          poster.slice(0, 5).map((posterData,index) => {
            return <Card  key={index} posterPath={posterData.posterPath} posterName={posterData.posterName}/>;
          })
        }
        </div>
    </div>
  )
}
