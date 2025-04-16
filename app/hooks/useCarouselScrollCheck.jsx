import { useEffect, useState } from "react";

export default function useCarouselScrollCheck(ref) {
  const [canScroll, setCanScroll] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      if (!ref.current) return;
      const { scrollWidth, clientWidth } = ref.current;
      setCanScroll(scrollWidth > clientWidth);
    };

    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [ref]);

  return canScroll;
}
