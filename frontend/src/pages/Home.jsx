import Carousel from '../components/Carousel'
import List from '../components/List'
import { useRecoilValueLoadable, useRecoilState } from 'recoil';
import { allStateSelector, carouselPosters, upcomingAnimes, upcomingMovies, upcomingSeries, watchlistState } from '../store/store';
import Companies from '../components/Companies';
import Footer from '../components/Footer';
import Welcome from '../components/Welcome';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchWatchlist } from '../services/watchlistService.js';
import Navbar from '../components/Navbar';

export default function Home() {
  const trending = useRecoilValueLoadable(allStateSelector);
  const images = useRecoilValueLoadable(carouselPosters);
  const upcomingMovie = useRecoilValueLoadable(upcomingMovies);
  const upcomingShows = useRecoilValueLoadable(upcomingSeries);
  const upcomingAnime = useRecoilValueLoadable(upcomingAnimes);
  const [watchlist, setWatchlist] = useRecoilState(watchlistState);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const loadables = [trending, images, upcomingMovie, upcomingShows, upcomingAnime];

  // Check if user is logged in and fetch watchlist
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      setIsLoggedIn(true);
      
      // Fetch user's watchlist
      const getWatchlist = async () => {
        try {
          const result = await fetchWatchlist();
          if (result && result.watchlist) {
            setWatchlist(result.watchlist);
          }
        } catch (error) {
          console.error("Error fetching watchlist:", error);
        }
      };
      
      getWatchlist();
    } else {
      setIsLoggedIn(false);
    }
  }, [setWatchlist]);

  if (loadables.some(l => l.state === 'loading')) {
    return <div className='h-screen flex justify-center items-center bg-black'>
      <button disabled type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center">
        <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
        </svg>
        Loading...
      </button>
    </div>
  }

  if (loadables.some(l => l.state === 'hasError')) {
    return (
      <div className='h-screen flex items-start justify-center bg-black text-white'>
        Oops!! Something Went Wrong
      </div>
    )
  }

  if (loadables.every(l => l.state === 'hasValue')) {
    return (
      <div className='flex flex-col min-h-screen'>
        <div className='flex-grow'>
          <Navbar isHomePage={true} hasBg={false} />
          
          {/* Welcome component */}
          <Welcome />
          
          {/* User's Watchlist Section - Only show if logged in and has items */}
          {isLoggedIn && watchlist.length > 0 && (
            <div className="bg-gradient-to-r from-[#0a1535] to-[#1e1040] py-8">
              <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-white">Continue Watching</h2>
                  <Link to="/profile" className="text-blue-400 hover:text-blue-300 transition-colors text-sm">
                    View All
                  </Link>
                </div>
                
                <div className="overflow-x-auto">
                  <div className="flex space-x-4 pb-4">
                    {watchlist.slice(0, 6).map(item => (
                      <Link 
                        to={`/details/${item.id}`} 
                        state={{ poster: item }} 
                        key={item.id}
                        className="flex-shrink-0 w-48 group"
                      >
                        <div className="relative rounded-lg overflow-hidden">
                          <img 
                            src={item.isAnime ? item.posterPath : `https://image.tmdb.org/t/p/w500${item.posterPath}`} 
                            alt={item.posterName || item.title} 
                            className="w-48 h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                            <span className="text-white font-medium">View Details</span>
                          </div>
                          {/* Play Button Overlay */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="bg-blue-600/80 rounded-full p-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                        <h3 className="mt-2 text-white font-medium truncate">
                          {item.posterName || item.title}
                        </h3>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <Carousel posters={images.contents} />
          <div className='text-white bg-black flex items-center justify-center'>
            <p className='py-6 px-3 font-custom4'>The all in one website for Pop Culture.</p>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" />
            </svg>
          </div>
          <List key="trending" title="" poster={trending.contents} isUpcoming={false}/>
          <Companies />
          <List key="upcomingMoviesList" title="Movies" poster={upcomingMovie.contents} isUpcoming={true}/>
          <List key="upcomingSeriesList" title="Series" poster={upcomingShows.contents} isUpcoming={true}/>
          <List key="upcomingAnimesList" title="Animes" poster={upcomingAnime.contents} isUpcoming={true} isAnime={true}/>
        </div>
        
        <Footer />
      </div>
    )
  }
  return null;
}
