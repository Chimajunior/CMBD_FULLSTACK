import { useRef, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function HorizontalScrollWrapper({ title, children }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  const scrollBy = (amount) => {
    scrollRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="relative">
        {canScrollLeft && (
          <button
            onClick={() => scrollBy(-300)}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 text-white p-2 rounded-full hover:bg-white hover:text-black transition"
          >
            <ChevronLeft />
          </button>
        )}

        {canScrollRight && (
          <button
            onClick={() => scrollBy(300)}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 text-white p-2 rounded-full hover:bg-white hover:text-black transition"
          >
            <ChevronRight />
          </button>
        )}

        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-4 snap-x snap-mandatory pb-2 hide-scrollbar"
        >
          {children}
        </div>
      </div>
    </div>
  );
}
