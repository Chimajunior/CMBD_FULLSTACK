import { useState, useEffect } from "react";
import { Star } from "lucide-react";

export default function ReviewForm({
  movieId,
  onReviewSubmit,
  initialRating = 0,
}) {
  const [rating, setRating] = useState(initialRating);
  const [hovered, setHovered] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    setRating(initialRating);
  }, [initialRating]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const token = localStorage.getItem("token");
    if (!token) return (window.location.href = "/login");

    if (!rating || !reviewText.trim()) {
      return setError("Please select a rating and write your review.");
    }



    const API_BASE =
    typeof window !== "undefined"
      ? window.ENV?.VITE_API_URL
      : process.env.VITE_API_URL || "http://localhost:5000";
    
    try {
      const res = await fetch(`${API_BASE}/api/reviews`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          movie_id: movieId,
          rating,
          review: reviewText,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Something went wrong.");
      } else {
        setToast("✅ Review submitted!");
        setReviewText("");
        onReviewSubmit?.();
      }
    } catch (err) {
      setError("Server error. Try again later.");
    } finally {
      setTimeout(() => setToast(""), 3000);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#1a1a1a] p-6 rounded-lg shadow max-w-3xl mx-auto text-white"
    >
      <h3 className="text-xl font-semibold mb-4">Leave a Review</h3>

      {error && <p className="text-red-500 mb-2">{error}</p>}
      {toast && (
        <div className="text-green-400 mb-3 text-sm font-medium">{toast}</div>
      )}

      <div className="flex items-center gap-2 mb-4">
        {[1, 2, 3, 4, 5].map((num) => (
          <Star
            key={num}
            size={28}
            onClick={() => setRating(num)}
            onMouseEnter={() => setHovered(num)}
            onMouseLeave={() => setHovered(null)}
            className={`cursor-pointer transition ${
              hovered >= num || rating >= num
                ? "fill-yellow-400 text-yellow-400 scale-110"
                : "text-gray-500"
            }`}
          />
        ))}
        <span className="text-white ml-2">{rating}/5</span>
      </div>

      <textarea
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        placeholder="Share your thoughts about the movie..."
        className="w-full h-28 bg-[#2a2a2a] border border-gray-700 p-3 rounded text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-500"
      />

      <button
        type="submit"
        className="mt-4 bg-yellow-500 text-black font-semibold px-6 py-2 rounded hover:bg-yellow-400 transition"
      >
        Submit Review
      </button>
    </form>
  );
}
