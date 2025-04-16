

import { useEffect, useState } from "react";
import { Link, useNavigate } from "@remix-run/react";
import { Star, PlusCircle, CheckCircle, X } from "lucide-react";
import RatingModal from "./RatingModal";

export default function MovieCard({ id, title, imageUrl, onWatchlistChange }) {
  const [isRatingOpen, setIsRatingOpen] = useState(false);
  const [avgRating, setAvgRating] = useState(0);
  const [myRating, setMyRating] = useState(0);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [poster, setPoster] = useState(imageUrl || "/godzilla.jpeg");
  const [toast, setToast] = useState("");
  const navigate = useNavigate();


  useEffect(() => {
    if (!id) return;
  
    // const API_BASE =
    // typeof window !== "undefined"
    //   ? window.ENV?.VITE_API_URL
    //   : process.env.VITE_API_URL || "http://localhost:5000";
      
    const fetchMovieData = async () => {
      try {
        const res = await fetch(`/api/movies/${id}`);
        const data = await res.json();
        const parsed = parseFloat(data.avg_rating);
        setAvgRating(!isNaN(parsed) ? parsed : 0);
        if (data.poster_url) setPoster(data.poster_url);
      } catch {
        setAvgRating(0);
      }
  
      const token = localStorage.getItem("token");
      if (!token) return;
  
      try {
        const res = await fetch(`${API_BASE}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = await res.json();
  
        const review = userData.reviews?.find((r) => r.movie_id === id);
        const ratingOnly = userData.rating_only?.find((r) => r.id === id);
  
        if (review) {
          setMyRating(review.rating);
        } else if (ratingOnly) {
          setMyRating(ratingOnly.rating);
        }
  
        setInWatchlist(userData.watchlist?.some((m) => m.id === id));
      } catch {
        console.warn("Failed to fetch profile");
      }
    };
  
    fetchMovieData();
  }, [id]);
  
  const toggleWatchlist = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate(`/login?redirectTo=/movies/${id}`);
  
    const API_BASE = import.meta.env.VITE_API_URL;
  
    try {
      const res = await fetch(`${API_BASE}/api/watchlist/toggle`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ movie_id: id }),
      });
  
      const result = await res.json();
      setInWatchlist(result.inWatchlist);
      setToast(
        result.inWatchlist
          ? "✅ Added to Watchlist"
          : "❌ Removed from Watchlist"
      );
      onWatchlistChange?.();
    } catch {
      setToast("⚠️ Watchlist update failed.");
    } finally {
      setTimeout(() => setToast(""), 2500);
    }
  };
  


  return (
    <>
      <div className="relative w-full aspect-[2/3] bg-[#272727] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition group">
        <Link to={`/movies/${id}`}>
          <img
            src={poster}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => (e.target.src = "/godzilla.jpeg")}
          />
        </Link>

        {/* Watchlist toggle */}
        <button
          onClick={toggleWatchlist}
          title={inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
          className="absolute top-2 left-2 z-10 bg-black/70 p-1 rounded-full text-white hover:scale-110 transition"
        >
          {inWatchlist ? (
            <CheckCircle className="text-yellow-400 w-5 h-5" />
          ) : (
            <PlusCircle className="w-5 h-5" />
          )}
        </button>

        {/* Toast */}
        {toast && (
          <div className="absolute top-3 right-2 text-sm bg-black/80 text-white px-3 py-1 rounded shadow flex items-center gap-2">
            {toast}
            <button onClick={() => setToast("")}>
              <X size={14} />
            </button>
          </div>
        )}

        {/* Bottom Rating Info */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-3 py-2">
          <div className="flex justify-between items-center mb-1">
            <span className="text-yellow-400 text-sm font-semibold">
              ⭐{" "}
              {typeof avgRating === "number" && !isNaN(avgRating)
                ? avgRating.toFixed(1)
                : "0.0"}
            </span>
            <button
              onClick={() => setIsRatingOpen(true)}
              className="bg-gray-800 px-2 py-1 rounded"
              title={
                myRating ? `Your Rating: ${myRating}/5` : "Rate this movie"
              }
            >
              <Star
                className={`w-5 h-5 transition-all duration-200 ${
                  myRating > 0 ? "fill-blue-500 text-blue-500" : "text-gray-400"
                }`}
              />
            </button>
          </div>
          <h3 className="text-white text-xs font-semibold truncate">{title}</h3>
        </div>
      </div>

      {/* Rating Modal */}
      <RatingModal
        isOpen={isRatingOpen}
        onClose={() => setIsRatingOpen(false)}
        movie={{ id, title }}
        onRate={(newRating) => setMyRating(newRating)}
        initialRating={myRating}
      />
    </>
  );
}
