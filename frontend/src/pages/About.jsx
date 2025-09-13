import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import photo1 from '../assets/Formal.jpg';
import photo2 from '../assets/image.png';

export default function About(){

  useEffect(()=>{
    window.scrollTo(0,0);
  },[]);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar isHomePage={false} hasBg={true} />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#0a1535] to-[#1e1040] py-20">
        <div className="max-w-3xl mx-auto px-4 text-center mt-6">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            About Akashic Records
          </motion.h1>
          <motion.p 
            className="text-lg text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Your ultimate destination for movies, TV shows, and anime information
          </motion.p>
        </div>
      </div>
      
      {/* Mission Section */}
      <div className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Mission</h2>
          <div className="bg-[#111] p-8 rounded-xl mb-12">
            <p className="text-lg mb-6">
              At Akashic Records, we believe in the power of storytelling. Our mission is to create a comprehensive, user-friendly platform that helps enthusiasts discover, track, and organize their entertainment journey across movies, TV series, and anime.
            </p>
            <p className="text-lg">
              Named after the mystical compendium of all universal events, Akashic Records aims to be your definitive guide through the vast universe of visual media. Whether you're tracking your watchlist, discovering new content, or diving deep into the details of your favorite shows, we're here to enhance your viewing experience.
            </p>
          </div>
        </div>
      </div>
      
      {/* Team Section */}
      <div className="py-12 px-4 bg-[#0a0a14]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">The Team</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-[#111] p-6 rounded-xl">
              <div className="flex items-start">
                <div className="w-40 h-24 rounded-full overflow-hidden mr-6">
                  <img 
                    src={photo1}
                    alt="Team member" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">Gourav Singh</h3>
                  <p className="text-blue-400 text-sm mb-3">Lead Developer</p>
                  <p className="text-gray-400">
                    Full-stack developer with a passion for creating seamless user experiences and building robust backend systems.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-[#111] p-6 rounded-xl">
              <div className="flex items-start">
                <div className="w-40 h-24 rounded-full overflow-hidden mr-6">
                  <img 
                    src={photo2} 
                    alt="Team member" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">Gourav, Dribble & Claude Sonnet 3.7</h3>
                  <p className="text-blue-400 text-sm mb-3">UI/UX Designer</p>
                  <p className="text-gray-400">
                    Creative designer focused on building intuitive interfaces that bridge aesthetics and functionality.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tech Stack Section */}
      <div className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Technology</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-[#111] p-6 rounded-xl text-center">
              <div className="text-4xl mb-4">⚛️</div>
              <h3 className="font-bold mb-2">React</h3>
              <p className="text-gray-400 text-sm">Frontend UI Library</p>
            </div>
            
            <div className="bg-[#111] p-6 rounded-xl text-center">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="font-bold mb-2">Node.js</h3>
              <p className="text-gray-400 text-sm">Backend Runtime</p>
            </div>
            
            <div className="bg-[#111] p-6 rounded-xl text-center">
              <div className="text-4xl mb-4">🍃</div>
              <h3 className="font-bold mb-2">MongoDB</h3>
              <p className="text-gray-400 text-sm">Database</p>
            </div>
            
            <div className="bg-[#111] p-6 rounded-xl text-center">
              <div className="text-4xl mb-4">🎬</div>
              <h3 className="font-bold mb-2">TMDB API</h3>
              <p className="text-gray-400 text-sm">Content Data</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="py-16 px-4 bg-gradient-to-r from-[#1e1040] to-[#0a1535]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Start Exploring Today</h2>
          <p className="text-lg text-gray-300 mb-8">
            Join our community and discover your next favorite movie, show, or anime!
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors">
              Browse Content
            </Link>
            <Link to="/signup" className="bg-[#333] hover:bg-[#444] text-white px-6 py-3 rounded-lg transition-colors">
              Create Account
            </Link>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}