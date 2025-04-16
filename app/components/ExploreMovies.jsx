





import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MovieCard from "../components/movie-card";

export default function ExploreMoviesSection() {
  const [movies, setMovies] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchMovies = async () => {
      const API_BASE = import.meta.env.VITE_API_URL;
  
      const res = await fetch(`${API_BASE}/api/movies?page=2&limit=20`);
      const data = await res.json();
      setMovies(data.movies || []);
    };
  
    fetchMovies();
  }, []);
  

  const scrollBy = (direction) => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.querySelector("div")?.offsetWidth || 250;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -cardWidth * 2 : cardWidth * 2,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="w-full bg-[#121212] text-white py-12 px-4 md:px-10 relative">
      <h2 className="text-2xl font-bold mb-6">Explore Movies</h2>

      <div className="relative">
        {/* Scroll Buttons */}
        <button
          onClick={() => scrollBy("left")}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-white hover:text-black p-2 rounded-full"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => scrollBy("right")}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-white hover:text-black p-2 rounded-full"
        >
          <ChevronRight size={20} />
        </button>

        {/* Scroll Container */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto scroll-smooth hide-scrollbar gap-6"
        >
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="flex-shrink-0 w-[240px]"
            >
              <MovieCard
                id={movie.id}
                title={movie.title}
                imageUrl={movie.poster_url}
                releaseDate={movie.release_date}
                rating={movie.avg_rating}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}





// // // // import { useEffect, useState, useRef } from "react";
// // // // import MovieCard from "../components/movie-card";
// // // // import { ChevronLeft, ChevronRight } from "lucide-react";

// // // // export default function ExploreMoviesSection() {
// // // //   const [exploreMovies, setExploreMovies] = useState([]);
// // // //   const scrollContainerRef = useRef(null);

// // // //   useEffect(() => {
// // // //     const fetchExplore = async () => {
// // // //       const res = await fetch("http://localhost:5000/api/movies?page=2&limit=12");
// // // //       const data = await res.json();
// // // //       setExploreMovies(data.movies || []);
// // // //     };
// // // //     fetchExplore();
// // // //   }, []);

// // // //   const scroll = (direction) => {
// // // //     if (scrollContainerRef.current) {
// // // //       const scrollAmount = scrollContainerRef.current.offsetWidth * 0.8;
// // // //       scrollContainerRef.current.scrollBy({
// // // //         left: direction === "left" ? -scrollAmount : scrollAmount,
// // // //         behavior: "smooth",
// // // //       });
// // // //     }
// // // //   };

// // // //   return (
// // // //     <div className="w-full bg-[#121212] py-12 px-4 md:px-10 relative">
// // // //       <h2 className="text-2xl font-bold text-white mb-6">Explore Movies</h2>

// // // //       <div className="relative">
// // // //         {/* Scroll Buttons */}
// // // //         <button
// // // //           onClick={() => scroll("left")}
// // // //           className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 p-2 rounded-full text-white hover:bg-white hover:text-black transition"
// // // //         >
// // // //           <ChevronLeft size={20} />
// // // //         </button>
// // // //         <button
// // // //           onClick={() => scroll("right")}
// // // //           className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 p-2 rounded-full text-white hover:bg-white hover:text-black transition"
// // // //         >
// // // //           <ChevronRight size={20} />
// // // //         </button>

// // // //         {/* Scroll Container */}
// // // //         <div
// // // //           ref={scrollContainerRef}
// // // //           className="overflow-x-auto scroll-smooth hide-scrollbar"
// // // //         >
// // // //           <div className="flex gap-6 w-max px-10">
// // // //             {exploreMovies.map((movie) => (
// // // //               <div
// // // //                 key={movie.id}
// // // //                 className="w-[200px] sm:w-[220px] md:w-[240px] flex-shrink-0"
// // // //               >
// // // //                 <MovieCard
// // // //                   id={movie.id}
// // // //                   title={movie.title}
// // // //                   imageUrl={movie.poster_url}
// // // //                   releaseDate={movie.release_date}
// // // //                   rating={movie.avg_rating}
// // // //                 />
// // // //               </div>
// // // //             ))}
// // // //           </div>
// // // //         </div>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }




// // // // // import { useEffect, useState, useRef } from "react";
// // // // // import MovieCard from "../components/movie-card";
// // // // // import { ChevronLeft, ChevronRight } from "lucide-react";

// // // // // export default function ExploreMoviesSection() {
// // // // //   const [exploreMovies, setExploreMovies] = useState([]);
// // // // //   const scrollRef = useRef(null);

// // // // //   useEffect(() => {
// // // // //     const fetchExplore = async () => {
// // // // //       const res = await fetch("http://localhost:5000/api/movies?page=2&limit=12");
// // // // //       const data = await res.json();
// // // // //       setExploreMovies(data.movies || []);
// // // // //     };
// // // // //     fetchExplore();
// // // // //   }, []);

// // // // //   const scrollByAmount = 300; // adjust for how much to scroll left/right

// // // // //   const scrollLeft = () => {
// // // // //     scrollRef.current?.scrollBy({ left: -scrollByAmount, behavior: "smooth" });
// // // // //   };

// // // // //   const scrollRight = () => {
// // // // //     scrollRef.current?.scrollBy({ left: scrollByAmount, behavior: "smooth" });
// // // // //   };

// // // // //   return (
// // // // //     <div className="bg-opacity-70 w-full flex flex-col gap-8 px-6 md:px-10 py-10 relative">
// // // // //       <h2 className="text-2xl text-white font-bold">Explore movies</h2>
// // // // //       <div className="relative">
// // // // //         <button
// // // // //           onClick={scrollLeft}
// // // // //           className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black/60 text-white p-2 rounded-full hover:bg-white hover:text-black transition"
// // // // //         >
// // // // //           <ChevronLeft />
// // // // //         </button>

// // // // //         <div ref={scrollRef} className="overflow-x-auto scroll-smooth hide-scrollbar">
// // // // //           <div className="flex gap-6 px-4 py-2">
// // // // //             {exploreMovies.map((movie) => (
// // // // //               <div
// // // // //                 key={movie.id}
// // // // //                 className="flex-shrink-0 w-[200px] sm:w-[240px] md:w-[260px]"
// // // // //               >
// // // // //                 <MovieCard
// // // // //                   id={movie.id}
// // // // //                   title={movie.title}
// // // // //                   imageUrl={movie.poster_url}
// // // // //                   releaseDate={movie.release_date}
// // // // //                   rating={movie.avg_rating}
// // // // //                 />
// // // // //               </div>
// // // // //             ))}
// // // // //           </div>
// // // // //         </div>

// // // // //         <button
// // // // //           onClick={scrollRight}
// // // // //           className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black/60 text-white p-2 rounded-full hover:bg-white hover:text-black transition"
// // // // //         >
// // // // //           <ChevronRight />
// // // // //         </button>
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // }




// // // // // // import { useEffect, useState } from "react";
// // // // // // import MovieCard from "../components/movie-card";
// // // // // // import { ChevronLeft, ChevronRight } from "lucide-react";


// // // // // // export default function Index() {
// // // // // //     const [exploreMovies, setExploreMovies] = useState([]);
// // // // // //     const [scrollIndex, setScrollIndex] = useState(0);
// // // // // //     const scrollLimit = 4; // cards per view
  
// // // // // //     useEffect(() => {
// // // // // //       const fetchExplore = async () => {
// // // // // //         const res = await fetch("http://localhost:5000/api/movies?page=2&limit=12");
// // // // // //         const data = await res.json();
// // // // // //         setExploreMovies(data.movies || []);
// // // // // //       };
// // // // // //       fetchExplore();
// // // // // //     }, []);
  
// // // // // //     const scrollLeft = () => {
// // // // // //       setScrollIndex((prev) => Math.max(0, prev - 1));
// // // // // //     };
  
// // // // // //     const scrollRight = () => {
// // // // // //       setScrollIndex((prev) => Math.min(exploreMovies.length - scrollLimit, prev + 1));
// // // // // //     };
  

// // // // // // {/* Explore Movies Section */}
// // // // // // <div className=" bg-opacity-70 w-full flex flex-col gap-8 p-10 relative">
// // // // // // <h2 className="text-2xl py-5 text-white font-bold">Explore movies</h2>
// // // // // // <div className="relative">
// // // // // //   <button
// // // // // //     onClick={scrollLeft}
// // // // // //     className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black/50 text-white p-2 rounded-full"
// // // // // //   >
// // // // // //     <ChevronLeft />
// // // // // //   </button>
// // // // // //   <div className="overflow-hidden">
// // // // // //     <div
// // // // // //       className="flex transition-transform duration-500 gap-6"
// // // // // //       style={{ transform: `translateX(-${scrollIndex * 25}%)` }}
// // // // // //     >
// // // // // //       {exploreMovies.map((movie) => (
// // // // // //         <div key={movie.id} className="min-w-[25%]">
// // // // // //           <MovieCard
// // // // // //             id={movie.id}
// // // // // //             title={movie.title}
// // // // // //             imageUrl={movie.poster_url}
// // // // // //             releaseDate={movie.release_date}
// // // // // //             rating={movie.avg_rating}
// // // // // //           />
// // // // // //         </div>
// // // // // //       ))}
// // // // // //     </div>
// // // // // //   </div>
// // // // // //   <button
// // // // // //     onClick={scrollRight}
// // // // // //     className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black/50 text-white p-2 rounded-full"
// // // // // //   >
// // // // // //     <ChevronRight />
// // // // // //   </button>
// // // // // // </div>
// // // // // // </div>
// // // // // // }