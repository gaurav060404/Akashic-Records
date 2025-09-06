import { useState, useEffect } from 'react';
import { useRecoilValueLoadable } from 'recoil';
import { carouselPosters } from '../store/store.jsx';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import '../index.css';
import logo from '../assets/logo.png';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const postersLoadable = useRecoilValueLoadable(carouselPosters);

  function handleLogin(e) {
    e.preventDefault();
    console.log("Login clicked");
  }

  // Rotate through posters every 5 seconds
  useEffect(() => {
    if (postersLoadable.state !== 'hasValue' || postersLoadable.contents.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % postersLoadable.contents.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [postersLoadable.state, postersLoadable.contents]);

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Loading state
  if (postersLoadable.state === 'loading') {
    return (
      <div className='h-screen flex justify-center items-center bg-black'>
        <button disabled type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center">
          <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
          </svg>
          Loading...
        </button>
      </div>
    );
  }

  // Error state
  if (postersLoadable.state === 'hasError') {
    return (
      <div className='h-screen flex items-start justify-center bg-black text-white'>
        Oops!! Something Went Wrong
      </div>
    );
  }

  // Loaded state - now we can safely use postersLoadable.contents
  const posters = postersLoadable.contents;

  return (
    <div className="signup-container">
      {/* Left side - Movie poster carousel */}
      <div className="poster-side">
        <div className="logo w-20 h-20">
          <img src={logo} alt="Logo" />
        </div>

        {/* Poster background container with base color */}
        <div className="poster-background-container">
          {/* Movie poster carousel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              className="poster-background"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              style={{
                backgroundImage: posters[currentSlide] ?
                  `url(https://image.tmdb.org/t/p/original${posters[currentSlide].backDropPath})` :
                  'none'
              }}
            />
          </AnimatePresence>

          {/* Overlay with content */}
          <div className="poster-overlay">
            <div className="tagline">
              <h2 className='text-center font-custom1'>Welcome Back</h2>
              <h2 className='text-center font-custom1'>To Your Akashic Journey</h2>
            </div>

            {/* Dots indicator */}
            <div className="carousel-dots">
              {posters.map((_, index) => (
                <span
                  key={index}
                  className={`dot ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="form-side">
        <div className="form-content">
          <h1>Log in</h1>
          <p className="account-prompt">Don't have an account? <Link to="/signup">Sign up</Link></p>

          <form className="signup-form" onSubmit={handleLogin}>
            <div className="input-group">
              <input type="email" placeholder="Email" required />
              <div className="email-icon">
                <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 0H2C0.9 0 0.00999999 0.9 0.00999999 2L0 14C0 15.1 0.9 16 2 16H18C19.1 16 20 15.1 20 14V2C20 0.9 19.1 0 18 0ZM18 4L10 9L2 4V2L10 7L18 2V4Z" fill="#A0A0A0" />
                </svg>
              </div>
            </div>

            <div className="input-group password-group">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div className="forgot-password">
              <Link to="/forgot-password">Forgot password?</Link>
            </div>

            <button
              type="submit"
              className="create-account-btn"
            >
              Log in
            </button>

            <div className="divider">
              <span>Or login with</span>
            </div>

            <div className="social-login">
              <button type="button" className="google-btn">
                <svg viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Google
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
