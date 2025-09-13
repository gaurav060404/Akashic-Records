import React, { useState, useEffect} from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(()=>{
      window.scrollTo(0,0);
    },[]);
  
  const faqData = [
    {
      question: "What is Akashic Records?",
      answer: "Akashic Records is a comprehensive platform that aggregates information about movies, TV shows, and anime. It helps you discover new content, keep track of what you want to watch, and organize your entertainment preferences all in one place."
    },
    {
      question: "Do I need to create an account?",
      answer: "While you can browse content without an account, creating a free account allows you to save items to your watchlist, track your watching progress, and receive personalized recommendations based on your preferences."
    },
    {
      question: "How do I add something to my watchlist?",
      answer: "To add an item to your watchlist, simply navigate to the movie, show, or anime you're interested in, and click the 'Add to Watchlist' button on the details page. You must be logged in to use this feature."
    },
    {
      question: "Where does your content information come from?",
      answer: "Our data is primarily sourced from The Movie Database (TMDB) API for movies and TV shows, and other reliable sources for anime content. We regularly update our database to provide the most accurate and current information."
    },
    {
      question: "Is Akashic Records free to use?",
      answer: "Yes, Akashic Records is completely free to use. We may introduce premium features in the future, but our core functionality will always remain free."
    },
    {
      question: "How can I search for specific content?",
      answer: "You can use the search bar located in the navigation menu to find movies, TV shows, or anime by title, actors, directors, or keywords."
    },
    {
      question: "Can I connect with other users?",
      answer: "Currently, Akashic Records is focused on personal tracking and discovery. Social features may be added in future updates to allow users to connect, share recommendations, and discuss content."
    },
    {
      question: "How do I report incorrect information or bugs?",
      answer: "If you notice any incorrect information or experience bugs while using Akashic Records, please contact us through our support email or use the feedback form available in your account settings."
    },
    {
      question: "Is there a mobile app available?",
      answer: "Currently, Akashic Records is optimized for web browsers on both desktop and mobile devices. A dedicated mobile app is in our development roadmap for the future."
    },
    {
      question: "Can I contribute to Akashic Records?",
      answer: "We welcome contributions from the community! If you're a developer, you can check out our GitHub repository. For content suggestions or corrections, please use our feedback channels."
    }
  ];

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar isHomePage={false} hasBg={true} />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#0a1535] to-[#1e1040] py-20">
        <div className="max-w-4xl mx-auto px-4 text-center mt-6">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Frequently Asked Questions
          </motion.h1>
          <motion.p 
            className="text-lg text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Find answers to common questions about Akashic Records
          </motion.p>
        </div>
      </div>
      
      {/* FAQ Accordion */}
      <div className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-6">
            {faqData.map((faq, index) => (
              <motion.div 
                key={index}
                className="bg-[#111] rounded-xl overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <button
                  className="w-full p-6 text-left flex justify-between items-center focus:outline-none"
                  onClick={() => toggleAccordion(index)}
                >
                  <span className="text-lg font-medium">{faq.question}</span>
                  <span className="text-2xl">
                    {activeIndex === index ? '−' : '+'}
                  </span>
                </button>
                
                <AnimatePresence>
                  {activeIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 pt-0 text-gray-300 border-t border-gray-700">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
          
          {/* Still Have Questions */}
          <div className="mt-16 text-center bg-[#0a0a14] p-8 rounded-xl">
            <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
            <p className="text-gray-300 mb-6">
              Can't find the answer you're looking for? Feel free to contact us directly.
            </p>
            <a 
              href="mailto:singhgourav.dev@gmail.com" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg inline-block transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}