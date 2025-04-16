import { useEffect, useState } from "react";
import { Link } from "@remix-run/react";
import ReviewCard from "./ReviewCard";

export default function MovieReviewSection({
  movieId,
  reviews: externalReviews,
}) {
  const [reviews, setReviews] = useState(externalReviews || []);
  const [toast, setToast] = useState("");

  // const fetchReviews = async () => {
  //   try {
  //     const res = await fetch(`http://localhost:5000/api/reviews/${movieId}`);
  //     const data = await res.json();
  //     if (!res.ok) throw new Error("Failed to fetch");
  //     setReviews(data);
  //   } catch (err) {
  //     console.error("Failed to fetch reviews", err);
  //   }
  // };

  // const handleHelpful = async (reviewId) => {
  //   const token = localStorage.getItem("token");
  //   if (!token) return alert("Login to vote helpful!");
  //   const alreadyVoted = reviews.find((r) => r.id === reviewId)?.voted;
  //   if (alreadyVoted) return;

  //   try {
  //     await fetch(`http://localhost:5000/api/reviews/${reviewId}/helpful`, {
  //       method: "POST",
  //       headers: { Authorization: `Bearer ${token}` },
  //     });

  //     setReviews((prev) =>
  //       prev.map((r) =>
  //         r.id === reviewId
  //           ? { ...r, helpful_count: (r.helpful_count || 0) + 1, voted: true }
  //           : r
  //       )
  //     );
  //   } catch (err) {
  //     console.error("Helpful vote failed:", err);
  //   }
  // };

  // const handleFlagReview = async (reviewId) => {
  //   const token = localStorage.getItem("token");
  //   if (!token) return alert("Login to report!");

  //   try {
  //     await fetch(`http://localhost:5000/api/reviews/${reviewId}/flag`, {
  //       method: "POST",
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     setToast("🚩 Review reported");
  //   } catch (err) {
  //     console.error("Failed to flag review:", err);
  //   } finally {
  //     setTimeout(() => setToast(""), 3000);
  //   }
  // };

  const API_BASE = import.meta.env.VITE_API_URL;

const fetchReviews = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/reviews/${movieId}`);
    const data = await res.json();
    if (!res.ok) throw new Error("Failed to fetch");
    setReviews(data);
  } catch (err) {
    console.error("Failed to fetch reviews", err);
  }
};

const handleHelpful = async (reviewId) => {
  const token = localStorage.getItem("token");
  if (!token) return alert("Login to vote helpful!");

  const alreadyVoted = reviews.find((r) => r.id === reviewId)?.voted;
  if (alreadyVoted) return;

  try {
    await fetch(`${API_BASE}/api/reviews/${reviewId}/helpful`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId
          ? { ...r, helpful_count: (r.helpful_count || 0) + 1, voted: true }
          : r
      )
    );
  } catch (err) {
    console.error("Helpful vote failed:", err);
  }
};

const handleFlagReview = async (reviewId) => {
  const token = localStorage.getItem("token");
  if (!token) return alert("Login to report!");

  try {
    await fetch(`${API_BASE}/api/reviews/${reviewId}/flag`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    setToast("🚩 Review reported");
  } catch (err) {
    console.error("Failed to flag review:", err);
  } finally {
    setTimeout(() => setToast(""), 3000);
  }
};


  useEffect(() => {
    if (!externalReviews) fetchReviews();
  }, [movieId]);

  const featuredReview = reviews.find((r) => r.review?.trim());

  return (
    <div className="w-full flex flex-col items-start pr-4 gap-10">
      {toast && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded z-50 bg-green-500 text-white font-semibold shadow">
          {toast}
        </div>
      )}
      <div className="bg-[#2a2a2a] w-full p-6 rounded-lg shadow-md">
        {reviews.length > 0 && featuredReview ? (
          <div className="space-y-4 animate-fade-in">
            <ReviewCard
              review={featuredReview}
              isUserReview={false}
              onHelpful={handleHelpful}
              onReport={handleFlagReview}
              toastHandler={(msg) => setToast(msg)}
            />

            {reviews.filter((r) => r.review?.trim()).length > 1 && (
              <div className="text-left mt-4">
                <Link
                  to={`/reviews/${movieId}`}
                  className="text-yellow-400 hover:underline hover:text-yellow-300 transition"
                >
                  Read All Reviews →
                </Link>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-400">No reviews yet.</p>
        )}
      </div>
    </div>
  );
}
