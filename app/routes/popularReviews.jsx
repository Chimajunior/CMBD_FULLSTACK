// routes/reviews/index.jsx
import { useEffect, useState } from "react";
import { Star, ThumbsUp } from "lucide-react";
import Navbar from "../components/nav";
import Footer from "../components/footer";
import { Link } from "@remix-run/react";

export default function PopularReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);



useEffect(() => {
  const API_BASE =
  typeof window !== "undefined"
    ? window.ENV?.VITE_API_URL
    : process.env.VITE_API_URL || "http://localhost:5000";
  
    fetch(`${API_BASE}/api/reviews`)
      .then((res) => res.json())
      .then((data) => {
        const sorted = [...(Array.isArray(data) ? data : [])].sort(
          (a, b) => (b.helpful_count || 0) - (a.helpful_count || 0)
        );
        setReviews(sorted);
      })
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, []);
  

  return (
    <div className="bg-[#121212] text-white min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto px-6 py-20 w-full">
        <h1 className="text-3xl font-bold mb-6 text-white flex items-center justify-between">
          All Popular Reviews{" "}
          <span className="text-yellow-400 text-lg font-semibold">
            ({reviews.length})
          </span>
        </h1>

        {loading ? (
          <p className="text-gray-400">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-gray-400 italic">
            No reviews found. Be the first to post one!
          </p>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="flex gap-4 items-start p-4 rounded-lg border border-gray-800 bg-[#1a1a1a] hover:shadow transition"
              >
                <Link to={`/movies/${review.movie_id}`}>
                  <img
                    src={
                      review.poster_url ||
                      "https://via.placeholder.com/80x120?text=No+Image"
                    }
                    alt={review.movie_title}
                    className="w-20 h-28 object-cover rounded-md"
                  />
                </Link>
                <div className="flex-1">
                  <Link to={`/movies/${review.movie_id}`}>
                    <h2 className="text-white font-semibold text-lg hover:underline">
                      {review.movie_title}
                    </h2>
                  </Link>
                  <p className="text-sm text-gray-300 mt-1">{review.review}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    by{" "}
                    <span className="text-white font-medium">
                      {review.username}
                    </span>
                  </p>
                  <div className="flex items-center text-yellow-400 mt-2 text-sm gap-1">
                    <ThumbsUp className="w-4 h-4" />
                    {review.helpful_count}
                  </div>
                </div>
                <div className="text-right flex flex-col items-end justify-between h-full">
                  <div className="text-yellow-400 flex items-center gap-1 text-sm font-bold">
                    {review.rating}
                    <Star className="w-4 h-4 fill-yellow-400" />
                  </div>
                  <p className="text-xs text-gray-500 mt-auto">
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
