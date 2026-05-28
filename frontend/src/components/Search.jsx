import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { searchMedia } from "../services/searchService.js";

export default function Search({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [debouncedQuery] = useDebounce(query, 500);
  const navigate = useNavigate();

  const {
    data: results = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['search', debouncedQuery, category],

    queryFn: () => searchMedia(debouncedQuery, category),

    enabled: debouncedQuery.trim().length >= 2,

    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setCategory('all');
    }
  }, [isOpen]);

  const handleItemClick = (item) => {
    navigate(`/details/${item.type}/${item.id}`);

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl mx-4 bg-gray-900 rounded-lg shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar */}
        <div className="flex items-center p-4 border-b border-gray-700">
          <FaSearch className="text-gray-400 mr-3" />


          <input
            type="text"
            placeholder="Search movies, series, anime, manga..."
            className="flex-1 bg-transparent text-white outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />

          <select
            value={category}
            onChange={(e) => {
              if (e.target.value === 'series') {
                setCategory('tv');
                return;
              }
              setCategory(e.target.value);
            }}
            className="bg-gray-800 text-white rounded px-2 py-1 mr-3 text-sm"
          >
            <option value="all">All</option>
            <option value="movie">Movies</option>
            <option value="tv">Series</option>
            <option value="anime">Anime</option>
            <option value="manga">Manga</option>
          </select>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <FaTimes />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[70vh] overflow-y-auto">
          {debouncedQuery.trim().length < 2 && (
            <div className="p-4 text-gray-400">
              Start typing to search...
            </div>
          )}

          {isLoading && (
            <div className="p-4 text-gray-400">
              Searching...
            </div>
          )}

          {isError && (
            <div className="p-4 text-red-400">
              Failed to fetch results
            </div>
          )}

          {!isLoading &&
            results.length === 0 &&
            debouncedQuery.trim().length >= 2 && (
              <div className="p-4 text-gray-400">
                No results found
              </div>
            )}

          {results.map((item) => (
            <button
              key={`${item.type}-${item.id}`}
              onClick={() => handleItemClick(item)}
              className="w-full flex items-center gap-4 p-4 hover:bg-gray-800 transition-colors text-left"
            >
              {item.poster ? (
                <img
                  src={item.poster}
                  alt={item.title}
                  className="w-12 h-16 object-cover rounded"
                />
              ) : (
                <div className="w-12 h-16 bg-gray-700 rounded flex items-center justify-center">
                  <FaSearch className="text-gray-500" />
                </div>
              )}

              <div className="flex-1">
                <h3 className="text-white font-medium">
                  {item.title}
                </h3>

                <p className="text-sm text-gray-400 capitalize">
                  {item.type} • {item.year || 'TBA'}
                </p>

                {typeof item.rating === 'number' && (
                  <p className="text-xs text-yellow-400">
                    ⭐ {item.rating.toFixed(1)}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}