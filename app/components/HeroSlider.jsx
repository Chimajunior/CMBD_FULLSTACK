import React, { useEffect, useState, useRef } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@remix-run/react";

export default function HeroSlider() {
  const [heroMovies, setHeroMovies] = useState([]);
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef();

 

  useEffect(() => {
      
    fetch(`/api/movies?featured=true&limit=6`)
      .then((res) => res.json())
      .then((data) => setHeroMovies(data.movies || []));
  }, []);
  

  useEffect(() => {
    if (heroMovies.length === 0) return;
    intervalRef.current = setInterval(() => {
      if (!isPaused) {
        setIndex((i) => (i + 1) % heroMovies.length);
      }
    }, 5000);
    return () => clearInterval(intervalRef.current);
  }, [heroMovies, isPaused]);

  if (heroMovies.length === 0) return null;

  const movie = heroMovies[index];
  const avgRating = parseFloat(movie.avg_rating || 0);
  const goPrev = () =>
    setIndex((prev) => (prev - 1 + heroMovies.length) % heroMovies.length);
  const goNext = () => setIndex((prev) => (prev + 1) % heroMovies.length);

  return (
    <div
      className="w-full md:h-[700px] py-10 md:py-0 flex flex-col justify-center items-center relative z-10"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="w-[95%] max-w-[1500px] flex flex-col md:flex-row justify-between items-center gap-8 md:gap-0 h-full md:h-[600px] relative z-10">
        {/* Arrows */}
        <button
          onClick={goPrev}
          className="hidden md:block absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 border border-white hover:bg-white hover:text-black rounded-full transition z-20"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={goNext}
          className="hidden md:block absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 border border-white hover:bg-white hover:text-black rounded-full transition z-20"
        >
          <ChevronRight size={24} />
        </button>

        {/* Mobile layout (image on top, text below) */}
        <div className="md:hidden flex flex-col items-center text-white text-center px-4">
          <img
            src={movie.poster_url}
            alt={movie.title}
            className="h-[400px] w-auto rounded-lg shadow-xl object-cover mb-4"
          />
          <h1 className="text-2xl font-bold" style={{ textShadow: "2px 2px 8px rgba(0,0,0,0.6)" }}>
            {movie.title}
          </h1>
          <div className="flex justify-center gap-x-1.5 my-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < Math.round(avgRating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-yellow-400"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-200 max-w-md" style={{ textShadow: "1px 1px 6px rgba(0,0,0,0.4)" }}>
            {movie.description?.slice(0, 120)}{movie.description?.length > 120 ? "..." : ""}
          </p>
          <Link
            to={`/movies/${movie.id}`}
            className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-2 rounded-full transition shadow-lg"
          >
            View more
          </Link>
        </div>

        {/* Desktop layout */}
        <div className="hidden md:flex w-full h-full justify-between items-center">
          <div className="w-[45%] flex justify-center">
            <img
              src={movie.poster_url}
              alt={movie.title}
              className="h-[520px] w-auto rounded-lg object-cover shadow-xl"
            />
          </div>
          <div className="w-[55%] flex flex-col justify-center text-white px-10">
            <h1 className="text-4xl font-bold mb-2" style={{ textShadow: "2px 2px 8px rgba(0,0,0,0.6)" }}>
              {movie.title}
            </h1>
            <div className="flex gap-x-1.5 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.round(avgRating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-yellow-400"
                  }`}
                />
              ))}
            </div>
            <p className="text-base font-light leading-relaxed text-gray-200 max-w-xl" style={{ textShadow: "1px 1px 6px rgba(0,0,0,0.4)" }}>
              {movie.description?.slice(0, 180)}{movie.description?.length > 180 ? "..." : ""}
            </p>
            <Link
              to={`/movies/${movie.id}`}
              className="mt-5 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-2 rounded-full transition shadow-lg w-max"
            >
              View more
            </Link>
          </div>
        </div>
      </div>

  {/* Dots */}
<div className="flex gap-2 mt-5 md:mt-8">
  {heroMovies.map((_, i) => (
    <button
      key={i}
      onClick={() => setIndex(i)}
      aria-label={`Go to slide ${i + 1}`}
      className={`w-2.5 h-2.5 rounded-full transition duration-300 ease-in-out ${
        i === index
          ? "bg-yellow-400 ring-1 ring-yellow-300 scale-105"
          : "bg-white/30 hover:bg-white/50"
      }`}
    />
  ))}
</div>



      {/* Background Blur */}
      <img
        src={movie.poster_url}
        alt=""
        className="absolute inset-0 w-full h-full object-cover blur-sm brightness-[0.4] -z-10"
      />
    </div>
  );
}






