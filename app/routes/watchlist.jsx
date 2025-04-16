import { useEffect, useState } from "react";
import Navbar from "../components/nav";
import { toast } from "sonner";
import MovieCard from "../components/MovieCard";

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);



useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) return;

  // const API_BASE =
  // typeof window !== "undefined"
  //   ? window.ENV?.VITE_API_URL
  //   : process.env.VITE_API_URL || "http://localhost:5000";

  fetch(`/api/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then((data) => {
      setWatchlist(data.watchlist || []);
    })
    .catch(() => toast.error("Failed to load watchlist."))
    .finally(() => setLoading(false));
}, []);

  return (
    <div className="bg-[#121212] min-h-screen text-white">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold mb-8 text-yellow-400">
          Your Watchlist
        </h1>

        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : watchlist.length === 0 ? (
          <p className="text-gray-400 italic">
            You haven’t added any movies to your watchlist yet.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {watchlist.map((movie) => (
              <MovieCard
                key={movie.id}
                id={movie.id}
                title={movie.title}
                poster_path={movie.poster_path}
                avgRating={movie.avgRating || movie.average_rating || 0}
                isWatchlisted={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
