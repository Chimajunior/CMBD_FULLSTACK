import { useState, useEffect } from "react";
import { Star, X } from "lucide-react";
import { useNavigate } from "@remix-run/react";

export default function ReviewForm({ movieId, onReviewSubmit, initialRating }) {
  const navigate = useNavigate();
  const [rating, setRating] = useState(initialRating || 0);
  const [hovered, setHovered] = useState(null);
  const [review, setReview] = useState("");
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialRating) setRating(initialRating);
  }, [initialRating]);



  // const API_BASE =
  // typeof window !== "undefined"
  //   ? window.ENV?.VITE_API_URL
  //   : process.env.VITE_API_URL || "http://localhost:5000";
  
const handleSubmit = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem("token");
  if (!token) return navigate("/login");

  if (!rating || review.trim() === "") {
    setError("Please provide a star rating and review text.");
    return;
  }

  setSubmitting(true);
  try {
    const res = await fetch(`/api/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ movie_id: movieId, rating, review }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Review submission failed.");

    setToast(" Review submitted!");
    setRating(0);
    setReview("");
    if (onReviewSubmit) onReviewSubmit();
  } catch (err) {
    setError(err.message);
  } finally {
    setSubmitting(false);
    setTimeout(() => setToast(""), 3000);
  }
};

  return (
    <>
      {toast && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-green-600 text-white px-5 py-2 rounded shadow flex items-center gap-2">
          {toast}
          <button onClick={() => setToast("")}>
            <X size={16} />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500">{error}</p>}

        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={26}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(null)}
              className={`cursor-pointer transition ${
                hovered >= star || rating >= star
                  ? "fill-yellow-400 text-yellow-400 scale-110"
                  : "text-gray-500"
              }`}
            />
          ))}
          <span className="ml-2 text-white/80">{rating}/5</span>
        </div>

        <textarea
          rows="4"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Write your review..."
          className="w-full p-3 rounded bg-[#2a2a2a] text-white border border-gray-600 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />

        <button
          type="submit"
          disabled={submitting}
          className="bg-yellow-500 text-black font-semibold px-6 py-2 rounded hover:bg-yellow-400 transition"
        >
          {submitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </>
  );
}
