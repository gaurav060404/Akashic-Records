import { useState, useEffect, useRef } from 'react'
import logo from '../assets/logo.png'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaSearch, FaUserCircle, FaSignOutAlt, FaUserAlt, FaChevronDown } from 'react-icons/fa'
import Search from './Search';
import defaultAvatar from '../assets/default-avatar.png';

export default function Navbar({ isHomePage, hasBg }) {
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Check authentication status on mount and when location changes
  useEffect(() => {
    checkAuthStatus();
  }, [location]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Track scroll position to add background when scrolling
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check if user is logged in
  const checkAuthStatus = () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      setIsLoggedIn(true);
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse user data', error);
        // Handle corrupted data by clearing it
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setUser(null);
      }
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    setDropdownOpen(false);
    navigate('/');
  };

  // Determine active link
  const isActive = (path) => location.pathname === path;

  // Toggle profile dropdown
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

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
            {/* Search button */}
            <button 
              className="text-white hover:text-orange-400 transition-colors"
              onClick={() => setIsSearchOpen(true)}
            >
              <FaSearch className="text-xl" />
            </button>

            {/* Conditional rendering based on authentication */}
            {isLoggedIn ? (
              <div className="relative" ref={dropdownRef}>
                {/* Profile display that triggers dropdown */}
                <button
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300"
                  onClick={toggleDropdown}
                >
                  <img
                    src={user?.avatar || defaultAvatar}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover border border-orange-400"
                    onError={(e) => {
                      console.log('Avatar failed to load, using default');
                      e.target.src = defaultAvatar;
                    }}
                  />
                  <span className="hidden sm:inline text-white font-medium">{user?.name || 'User'}</span>
                  <FaChevronDown className={`text-xs text-white transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 py-2 bg-gray-900 rounded-md shadow-xl z-50 border border-gray-800">
                    <Link 
                      to="/profile" 
                      className="flex items-center px-4 py-2 text-white hover:bg-gray-800 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <FaUserAlt className="mr-2" />
                      My Profile
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-2 text-white hover:bg-gray-800 transition-colors"
                    >
                      <FaSignOutAlt className="mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-white hover:text-orange-400 transition-colors px-3 py-2"
                >
                  Log in
                </Link>
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
            )}
          </div>
        </div>
      </div>

      {/* Add Search component */}
      <Search isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
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
  );
}
