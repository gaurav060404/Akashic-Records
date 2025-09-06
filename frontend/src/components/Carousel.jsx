import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useRecoilState } from "recoil";
import { slideIndex } from "../store/store";

export default function Carousel({ images }) {
  const [slide, setSlide] = useRecoilState(slideIndex);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (images.length === 0) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);

      setTimeout(() => {
        setSlide((prev) => (prev + 1) % images.length);
        setIsTransitioning(false);
      }, 300); // Half of transition duration

    }, 6000);

    return () => clearInterval(interval);
  }, [images, setSlide]);

  const currentImage = images[slide % images.length];
  const nextImage = images[(slide + 1) % images.length];
  const currentMovieName = images?.[slide % images.length];

  return (
    <div className="h-screen w-full relative overflow-hidden">
      {/* Navbar */}
      <Navbar isHomePage={true} hasBg={false} />

      {/* Background Images with Crossfade Animation */}
      {images.length > 0 && (
        <div className="absolute inset-0">
          {/* Current Image */}
          <img
            src={`https://image.tmdb.org/t/p/original/${currentImage.backDropPath}`}
            alt={`Carousel ${slide}`}
            className={`absolute inset-0 h-full w-full object-cover transition-all duration-1000 ease-in-out transform ${isTransitioning
              ? 'opacity-0 scale-105'
              : 'opacity-100 scale-100'
              }`}
          />

          {/* Next Image (for smooth transition) */}
          {nextImage && (
            <img
              src={`https://image.tmdb.org/t/p/original/${nextImage.backDropPath}`}
              alt={`Carousel ${slide + 1}`}
              className={`absolute inset-0 h-full w-full object-cover transition-all duration-1000 ease-in-out transform ${isTransitioning
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-110'
                }`}
            />
          )}

          {/* Gradient Overlay with Animation */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent transition-opacity duration-500 ${isTransitioning ? 'opacity-80' : 'opacity-100'
            }`}></div>
        </div>
      )}

      {/* Hero Content with Subtle Animation */}
      <div className="absolute -bottom-9 left-0 w-full h-1/3 z-20 flex flex-col gap-1 justify-center items-start pl-8 md:pl-16 lg:pl-32 pb-16">
        <h1 className={`font-custom4 text-2xl md:text-3xl lg:text-[3rem] font-extrabold text-white leading-tight drop-shadow-xl mb-4 transition-all duration-700 ease-out ${isTransitioning
          ? 'transform translate-y-2 opacity-90'
          : 'transform translate-y-0 opacity-100'
          }`}>
          The Records Of Akasha
        </h1>

        <p className={`text-lg md:text-[14px] text-gray-200 max-w-2xl leading-relaxed mb-6 transition-all duration-700 ease-out delay-100 ${isTransitioning
          ? 'transform translate-y-2 opacity-80'
          : 'transform translate-y-0 opacity-100'
          }`}>
          The ultimate archive for your favorite Movies, TV Shows, and Anime.
        </p>

        <div
          className={`flex gap-4 flex-wrap transition-all duration-700 ease-out delay-200 ${isTransitioning
              ? "translate-y-2 opacity-80"
              : "translate-y-0 opacity-100"
            }`}
        >
          <button className="rounded-lg bg-white h-12 text-black font-custom4 text-base px-8 shadow-md hover:bg-green-500 hover:text-white hover:scale-105 transition-transform duration-300">
            Login
          </button>

          <button className="rounded-lg h-12 border-2 border-white text-white font-custom4 text-base px-8 shadow-md hover:bg-green-500 hover:text-white hover:scale-105 transition-transform duration-300">
            Signup
          </button>
        </div>
      </div>

      {/* Movie Name - Bottom Right */}
      <div className="absolute bottom-7 right-14 z-30">
        <div className={`backdrop-blur-sm px-4 py-2 transition-all duration-700 ease-out ${isTransitioning
          ? 'transform translate-y-2 opacity-70'
          : 'transform translate-y-0 opacity-100'
          }`}>
          <p className="text-white text-sm font-custom4 drop-shadow-lg opacity-45">
            {currentMovieName.title}
          </p>
        </div>
      </div>
    </div>
  );
}
