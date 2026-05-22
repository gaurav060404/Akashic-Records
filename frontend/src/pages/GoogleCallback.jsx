import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const userData = searchParams.get('user');

    if (token) {
      try {
        // Store token
        localStorage.setItem('token', token);
        
        if (userData) {
          // Parse and store user data if provided
          const user = JSON.parse(decodeURIComponent(userData));
          const userDataToStore = {
            name: user.name,
            avatar: user.avatar || user.picture,
            id: user.id
          };
          localStorage.setItem('user', JSON.stringify(userDataToStore));
          navigate('/');
        } else {
          // If no user data, fetch it from backend
          fetchUserData(token);
        }
      } catch (error) {
        console.error('Error processing Google callback:', error);
        navigate('/login?error=auth_failed');
      }
    } else {
      navigate('/login?error=auth_failed');
    }
  }, [navigate, searchParams]);

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
      navigate('/');
    } catch (error) {
      console.error('Error fetching user data:', error);
      localStorage.removeItem('token');
      navigate('/login?error=auth_failed');
    }
  };

  return (
    <div className='h-screen flex justify-center items-center bg-black text-white'>
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
        <p>Completing Google sign in...</p>
      </div>
    </div>
  );
};

export default GoogleCallback;