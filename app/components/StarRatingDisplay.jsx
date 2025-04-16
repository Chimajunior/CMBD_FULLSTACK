import { Star } from "lucide-react";

export default function StarRatingDisplay({ rating, size = 24, className = "" }) {
  const rounded = Math.round(rating);

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={
            i <= rounded
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-600"
          }
        />
      ))}
    </div>
  );
}
