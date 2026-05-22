import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import logo from '../assets/logo.png';

export default function Footer() {
  const year = new Date().getFullYear();
  
  return (
    <footer className="bg-black text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Replace the full white border with a subtle gradient divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-10"></div>
        
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8 pb-8 border-b border-gray-800">
          {/* Company info */}
          <div>
            <Link to="/" className="flex items-center mb-4">
              <img src={logo} alt="Akashic Records" className="h-10" />
            </Link>
            <p className="text-sm text-gray-400 mb-6">
              Your ultimate destination for movies, TV shows, and anime information.
              Discover, track, and organize your entertainment universe.
            </p>
            <div className="flex space-x-4">
              <a href="https://github.com/gaurav060404" target="_blank" rel="noopener noreferrer" 
                 className="text-gray-400 hover:text-white transition-colors">
                <FaGithub size={20} />
              </a>
              <a href="https://www.linkedin.com/in/gourav-singh060404/" target="_blank" rel="noopener noreferrer" 
                 className="text-gray-400 hover:text-white transition-colors">
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/movies" className="text-gray-400 hover:text-white transition-colors">
                  Movies
                </Link>
              </li>
              <li>
                <Link to="/series" className="text-gray-400 hover:text-white transition-colors">
                  TV Series
                </Link>
              </li>
              <li>
                <Link to="/anime" className="text-gray-400 hover:text-white transition-colors">
                  Anime
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-400 hover:text-white transition-colors">
                  My Watchlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Help & Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Help & Info</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-4">
          <p className="text-sm text-gray-500 mb-4 md:mb-0">
            © {year} Akashic Records. All rights reserved.
          </p>
          
          <div className="flex flex-wrap justify-center space-x-4 text-sm text-gray-500">
            <span>
              Powered by{" "}
              <a 
                href="https://www.themoviedb.org/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-400 transition-colors"
              >
                TMDB
              </a>
            </span>
            <span>
              Built with{" "}
              <a 
                href="https://reactjs.org/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-400 transition-colors"
              >
                React
              </a>
              {" "}& ❤️
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}