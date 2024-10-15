import Card from './Card'
import { Link } from 'react-router-dom'

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export default function List({title,poster}) {
  const shuffledPosters = shuffleArray([...poster]).slice(0, 5);
  return (
    <div className='bg-black h-96 flex-row'>
        <div className='w-full text-white flex justify-between items-center px-24 pt-4'>
          <Link className='font-custom3 text-2xl hover:text-blue-300' to={`/${title.toLowerCase()}`}>Trending {title}</Link>
          {title!="" &&
            <Link to={`/${title.toLowerCase()}`} className='hover:text-blue-400 cursor-pointer font-custom3 text-xs text-slate-300'>
            View All
            </Link>
          }
        </div>
        <div className='bg-black h-80 flex justify-evenly'>
        {
          shuffledPosters.map((posterData,index) => {
            return <Card  key={index} posterPath={posterData.posterPath} posterName={posterData.posterName}/>;
          })
        }
        </div>
    </div>
  )
}
