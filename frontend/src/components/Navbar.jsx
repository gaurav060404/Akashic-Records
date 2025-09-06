import React, { useState, useEffect } from 'react'
import logo from '../assets/logo.png'
import { Link, useLocation } from 'react-router-dom'
import { FaSearch, FaUserCircle } from 'react-icons/fa'
import Search from './Search';

export default function Navbar({ isHomePage, hasBg }) {
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();

  // Track scroll position to add background when scrolling
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine active link
  const isActive = (path) => location.pathname === path;

  return (
    <>
      <div className={`
        fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out
        ${hasBg || scrolled ? 'bg-gradient-to-r from-black/80 to-gray-900/80 backdrop-blur-md py-3 shadow-lg' : 'bg-transparent py-5'}
      `}>
        <div className="container mx-auto flex justify-between items-center px-6 lg:px-10">
          {/* Logo */}
          <Link to={'/'} className="flex-shrink-0">
            <img
              src={logo}
              alt="Logo"
              className='w-28 md:w-32 hover:drop-shadow-lg transition-all duration-300'
            />
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center">
            <ul className='flex items-center gap-2 lg:gap-8 text-base font-custom1'>
              {!isHomePage && (
                <NavLink to="/" isActive={isActive("/")}>
                  Home
                </NavLink>
              )}
              <NavLink to="/movies" isActive={isActive("/movies")}>
                Movies
              </NavLink>
              <NavLink to="/series" isActive={isActive("/series")}>
                Series
              </NavLink>
              <NavLink to="/anime" isActive={isActive("/anime")}>
                Anime
              </NavLink>
            </ul>
          </nav>

          {/* Right section - Search and Account */}
          <div className="flex items-center gap-5">
            <button 
              className="text-white hover:text-orange-400 transition-colors"
              onClick={() => setIsSearchOpen(true)}
            >
              <FaSearch className="text-xl" />
            </button>

            <Link
              to="/signup"
              className={`
                flex items-center gap-2 px-5 py-2 rounded-full font-medium
                ${isActive("/signup")
                  ? 'bg-orange-500 text-white'
                  : 'bg-white/10 hover:bg-white/20 text-white hover:text-white'}
                transition-all duration-300 backdrop-blur-sm
              `}
            >
              <FaUserCircle />
              <span className="hidden sm:inline">Sign Up</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Add Search component */}
      <Search isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}

// NavLink component for consistent styling
function NavLink({ children, to, isActive }) {
  return (
    <li>
      <Link
        to={to}
        className={`
          relative px-3 py-2 font-medium text-sm lg:text-base
          transition-all duration-300 ease-in-out
          ${isActive
            ? 'text-orange-400'
            : 'text-white hover:text-orange-300'}
        `}
      >
        {children}
        <span className={`
          absolute bottom-0 left-0 w-full h-0.5 bg-orange-400 transform origin-left
          transition-transform duration-300 ease-out
          ${isActive ? 'scale-x-100' : 'scale-x-0 hover:scale-x-100'}
        `}></span>
      </Link>
    </li>
  )
}
