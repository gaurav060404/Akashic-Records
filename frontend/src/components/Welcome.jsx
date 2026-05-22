import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Welcome({ watchlist = [] }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch {
                setUser(null);
            }
        } else {
            setUser(null);
        }
    }, []);

    return (
        <>
            {user ? (
                <div className="bg-gradient-to-r from-[#0a1535] to-[#1e1040] py-6 px-4">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-2xl font-custom4 mb-4">Welcome back, {user.name}</h2>
                        {watchlist.length > 0 && (
                            <div className="mb-8">
                                <h3 className="text-xl mb-3 flex items-center">
                                    <span>Continue watching</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                    </svg>
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                    {watchlist.slice(0, 6).map(item => (
                                        <Link to={`/details/${item.id}`} state={{ poster: item }} key={item.id}>
                                            <div className="relative rounded-lg overflow-hidden">
                                                <img
                                                    src={item.isAnime ? item.posterPath : `https://image.tmdb.org/t/p/w500${item.posterPath}`}
                                                    alt={item.title}
                                                    className="w-full h-40 object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                    <span className="text-white font-medium">Continue</span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ) : null}
        </>
    );
}
