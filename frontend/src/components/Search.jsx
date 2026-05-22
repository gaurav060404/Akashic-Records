import React, { useState, useEffect } from 'react';
import { useRecoilValueLoadable } from 'recoil';
import { searchResults } from '../store/store';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaTimes } from 'react-icons/fa';

export default function Search({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const searchLoadable = useRecoilValueLoadable(searchResults(debouncedQuery));
  const navigate = useNavigate();

  // debounce query
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedQuery(query), 400);
    return () => clearTimeout(timeout);
  }, [query]);

  const handleItemClick = (item) => {
    const posterData = {
      id: item.id,
      title: item.title,
      posterPath: item.poster,
      backDropPath: item.backdrop || item.poster,
      overview: item.overview || "No overview available.",
      rating: item.rating || 0,
      popularity: item.popularity || null,
      releaseDate: item.releaseDate,
      type: item.type,
      isAnime: item.type === "Anime",
      genres: item.genres || [],
      languages: item.languages || [],
      director: item.director || "Unknown",
      credits: item.casts || [],
      trailer: item.trailerUrl || null,
      seasons: item.seasons ?? 0,
      episodes: item.episodes ?? 0,
      runtime: item.runtime,
      users: item.users
    };

    navigate(`/details/${item.id}`, { state: { poster: posterData } });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20"
      onClick={onClose}
    >
      <div
        className="search-container w-full max-w-2xl mx-4 bg-gray-900 rounded-lg shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar */}
        <div className="flex items-center p-4 border-gray-700">
          <FaSearch className="text-gray-400 mr-3" />
          <input
            type="text"
            placeholder="Search movies, series, anime..."
            className="flex-1 bg-transparent text-white outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <FaTimes />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[70vh] overflow-y-auto">
          {searchLoadable.state === 'loading' && (
            <div className="p-4 text-gray-400">Searching...</div>
          )}

          {searchLoadable.state === 'hasValue' &&
            searchLoadable.contents.length === 0 &&
            query.length >= 2 && (
              <div className="p-4 text-gray-400">No results found</div>
            )}

          {searchLoadable.state === 'hasValue' &&
            searchLoadable.contents.map((item) => (
              <div
                key={`${item.type}-${item.id}`}
                onClick={() => handleItemClick(item)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleItemClick(item);
                  }
                }}
                className="flex items-center gap-4 p-4 hover:bg-gray-800 transition-colors cursor-pointer"
              >
                {item.poster ? (
                  <img
                    src={item.title == "Anime" || item.type == "Anime" ? item.poster : `https://image.tmdb.org/t/p/w500${item.poster}`}
                    alt={item.title}
                    className="w-12 h-16 object-cover rounded"
                  />
                ) : (
                  <div className="w-12 h-16 bg-gray-700 rounded flex items-center justify-center">
                    <FaSearch className="text-gray-500" />
                  </div>
                )}
                <div>
                  <h3 className="text-white font-medium">{item.title}</h3>
                  <p className="text-sm text-gray-400">
                    {item.type} • {item.releaseDate || "TBA"}
                  </p>
                  {typeof item.rating === "number" && (
                    <p className="text-xs text-yellow-400">
                      ⭐ {item.rating.toFixed(1)}
                    </p>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
