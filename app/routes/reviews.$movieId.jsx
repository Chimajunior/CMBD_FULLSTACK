import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { useEffect, useState } from "react";
import Navbar from "../components/nav";
import Footer from "../components/footer";
import ReviewForm from "../components/ReviewForm";
import ReviewCard from "../components/ReviewCard";

// const API_BASE =
//   typeof window !== "undefined"
//     ? window.ENV?.VITE_API_URL
//     : process.env.VITE_API_URL || "http://localhost:5000";



export const loader = async ({ params, request }) => {
  const { movieId } = params;
  const token = request.headers.get("Authorization");

  const origin = new URL(request.url).origin;

  // Fetch movie
  const movieRes = await fetch(`${origin}/api/movies/${movieId}`);
  if (!movieRes.ok) throw new Response("Movie not found", { status: 404 });
  const movie = await movieRes.json();

  // Fetch reviews
  const reviewsRes = await fetch(`${origin}/api/reviews/${movieId}`, {
    headers: token ? { Authorization: token } : {},
  });
  const reviews = await reviewsRes.json();

  return json({ movie, reviews });
};


export default function ReviewsPage() {
  const { movie, reviews: initialReviews } = useLoaderData();
  const [reviews, setReviews] = useState(initialReviews);
  const [toast, setToast] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp < now) {
          localStorage.removeItem("token");
          setUserId(null);
        } else {
          setUserId(payload.id);
        }
      }
    } catch {
      setUserId(null);
    }
  }, []);

  const userReview = userId
    ? reviews.find((r) => r.user_id === userId && r.review?.trim())
    : null;

  const otherReviews = reviews
    .filter((r) => r.user_id !== userId && r.review?.trim())
    .sort((a, b) => b.helpful_count - a.helpful_count);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  //fetch latest reviews
  const fetchLatest = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`/api/reviews/${movie.id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    const updated = await res.json();
    setReviews(updated);
  };
  
// handle helpul
  const handleHelpful = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return (window.location.href = "/login");
  
    try {
      await fetch(`/api/reviews/${id}/helpful`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchLatest();
      showToast(" Marked as helpful!");
    } catch {
      showToast("You’ve already marked this review.");
    }
  };
  
//handle reporting a review
  const handleReport = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return (window.location.href = "/login");
  
    try {
      await fetch(`/api/reviews/${id}/flag`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast(" Review reported for moderation.");
    } catch {
      showToast("Failed to report.");
    }
  };
  

  return (
    <div className="min-h-screen bg-[#121212] text-white px-6">
      <Navbar />

      {toast && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded z-50 font-semibold shadow bg-yellow-500 text-black">
          {toast}
        </div>
      )}

      <main className="max-w-6xl mx-auto pt-28 pb-16 px-4">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-10">
          <img
            src={movie.poster_url}
            alt={movie.title}
            className="w-20 md:w-20 rounded shadow-md"
          />
          <h1 className="text-3xl font-bold pt-16">
            All Reviews <br />
            for <span className="text-yellow-400 italic">{movie.title}</span>
          </h1>
        </div>

        <div className="flex flex-col gap-6">
          {userReview && (
            <ReviewCard
              review={userReview}
              isUserReview
              onHelpful={handleHelpful}
              onReport={handleReport}
              toastHandler={showToast}
            />
          )}

          {otherReviews.map((r) => (
            <ReviewCard
              key={r.id}
              review={r}
              onHelpful={handleHelpful}
              onReport={handleReport}
              toastHandler={showToast}
            />
          ))}
        </div>

        <div className="mt-12 bg-[#1a1a1a] p-6 rounded-lg shadow-md">
          <ReviewForm movieId={movie.id} onReviewSubmit={fetchLatest} />
        </div>
      </main>

      <Footer />
    </div>
  );
}





