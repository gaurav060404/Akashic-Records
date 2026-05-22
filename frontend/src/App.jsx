import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Home from './pages/Home'
import Signup from './pages/Signup'
import Movies from './pages/Movies'
import Series from './pages/Series'
import Anime from './pages/Anime'
import { RecoilRoot } from 'recoil'
import NotFound from './pages/NotFound'
import Details from './pages/Details'
import Login from './pages/Login'
import GoogleCallback from './pages/GoogleCallback'
import { useEffect } from 'react';
import axios from 'axios';
import Profile from "./pages/Profile";
import { Toaster } from 'react-hot-toast';
import About from './pages/About.jsx';
import FAQ from './pages/FAQ.jsx';

export default function App() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const userData = urlParams.get('user');
    
    if (token) {
      try {
        localStorage.setItem('token', token);
        
        if (userData) {
          const user = JSON.parse(decodeURIComponent(userData));
          const userDataToStore = {
            name: user.name,
            avatar: user.avatar || user.picture,
            id: user.id
          };
          localStorage.setItem('user', JSON.stringify(userDataToStore));
        } else {
          // If no user data provided, fetch it from the backend
          fetchUserData(token);
        }
        
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (error) {
        console.error('Error processing Google OAuth:', error);
      }
    }
  }, []);

  // Fetch user data from backend if not provided in URL
  const fetchUserData = async (token) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const userData = {
        name: response.data.name,
        avatar: response.data.avatar || response.data.picture,
        id: response.data.id
      };
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Error fetching user data:', error);
      localStorage.removeItem('token');
    }
  };

  return (
    <BrowserRouter>
    <RecoilRoot>
    <div>
      <Routes>
        <Route path='/' element={<Home/>} ></Route>
        <Route path='/signup' element={<Signup/>} ></Route>
        <Route path='/login' element={<Login/>} ></Route>
        <Route path='/anime' element={<Anime/>} ></Route>
        <Route path='/movies' element={<Movies/>} ></Route>
        <Route path='/series' element={<Series/>} ></Route>
        <Route path='/:title/:id' element={<Details/>} ></Route>
        <Route path='/:category/rated/:id/:posterName' element={<Details/>} ></Route>
        <Route path='/google/callback' element={<GoogleCallback />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path='*' element={<NotFound/>}></Route>
      </Routes>
      <Toaster 
        position="top-center"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          // Default options for all toasts
          duration: 5000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          // Different styles based on toast type
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10B981',
              secondary: 'white',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#EF4444',
              secondary: 'white',
            },
          },
        }}
      />
    </div>
    </RecoilRoot>
    </BrowserRouter>
  )
}
