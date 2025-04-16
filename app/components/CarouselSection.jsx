import { useRef, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useCarouselScrollCheck from "../hooks/useCarouselScrollCheck";
import MovieCard from "./MovieCard";

export default function CarouselSection({ items = [], sectionId, badge }) {
  const carouselRef = useRef(null);
  const canScroll = useCarouselScrollCheck(carouselRef);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!carouselRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setAtStart(scrollLeft <= 10);
      setAtEnd(scrollLeft + clientWidth >= scrollWidth - 10);
    };

    const el = carouselRef.current;
    if (el) {
      el.addEventListener("scroll", handleScroll);
      handleScroll(); // initial call
    }

    return () => {
      el?.removeEventListener("scroll", handleScroll);
    };
  }, [items]);

  const scrollBy = (amount) => {
    carouselRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  };

  const showArrows = canScroll || items.length > 3;
  if (!items || items.length === 0) return null;

  return (
    <div className="relative">
      {showArrows && !atStart && (
        <button
          onClick={() => scrollBy(-320)}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 border border-white rounded-full hover:bg-white hover:text-black transition z-20"
        >
          <ChevronLeft />
        </button>
      )}

      <div
        id={sectionId}
        ref={carouselRef}
        className="flex overflow-x-auto scroll-smooth snap-x gap-6 hide-scrollbar pb-2 px-2"
      >
        {items.map((movie) => (
          <div
            key={movie.id}
            className="relative snap-start flex-shrink-0 w-[180px] sm:w-[220px] md:w-[240px] lg:w-[260px] xl:w-[280px]"
          >
            <MovieCard {...movie} />
            {badge && (
              <span className="absolute top-2 right-2 bg-yellow-400 text-black text-[10px] px-2 py-[2px] rounded font-semibold shadow">
                {badge}
              </span>
            )}
          </div>
        ))}
      </div>

      {showArrows && !atEnd && (
        <button
          onClick={() => scrollBy(320)}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 border border-white rounded-full hover:bg-white hover:text-black transition z-20"
        >
          <ChevronRight />
        </button>
      )}
    </div>
  );
}
