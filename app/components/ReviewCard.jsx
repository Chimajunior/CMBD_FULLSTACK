import { useEffect, useRef, useState } from "react";
import { Link } from "@remix-run/react";

import {
  Star,
  ThumbsUp,
  MoreVertical,
  Flag,
  Facebook,
  Twitter,
  Copy,
} from "lucide-react";

export default function ReviewCard({
  review,
  isUserReview,
  onHelpful,
  onReport,
  toastHandler,
}) {
  const [openMenu, setOpenMenu] = useState(false);
  const [reviewUrl, setReviewUrl] = useState("");
  const menuRef = useRef(null);

  const isVoted =
    review.voted === true || review.voted === 1 || review.voted === "1";

  const tweetText = `Check out this review on "${review.movie_title || "this movie"}"`;

  // Safe window access
  useEffect(() => {
    if (typeof window !== "undefined") {
      setReviewUrl(
        `${window.location.origin}${window.location.pathname}#review-${review.id}`
      );
    }
  }, [review.id]);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      id={`review-${review.id}`}
      className="bg-[#1a1a1a] p-6 rounded-lg shadow-md relative"
    >
      {isUserReview && (
        <div className="absolute top-0 left-0 bg-yellow-500 text-black text-xs px-2 py-1 rounded-br font-semibold">
          Your Review
        </div>
      )}

      <button
        onClick={() => setOpenMenu((prev) => !prev)}
        className="absolute top-2 right-2 text-white hover:text-gray-300"
      >
        <MoreVertical size={20} />
      </button>

      {openMenu && (
        <div
          ref={menuRef}
          className="absolute right-2 top-10 bg-[#1f1f1f] shadow-md rounded z-10 w-48 border border-gray-700"
        >
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              reviewUrl
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 hover:bg-[#2a2a2a] text-sm flex items-center gap-2"
          >
            <Facebook size={14} /> Facebook
          </a>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
              tweetText
            )}&url=${encodeURIComponent(reviewUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 hover:bg-[#2a2a2a] text-sm flex items-center gap-2"
          >
            <Twitter size={14} /> X
          </a>
          <button
            onClick={() => {
              navigator.clipboard.writeText(reviewUrl);
              toastHandler(" Review link copied!");
              setOpenMenu(false);
            }}
            className="w-full text-left px-4 py-2 hover:bg-[#2a2a2a] text-sm flex items-center gap-2 border-b-1"
          >
            <Copy size={14} /> Copy Link
          </button>
          <button
            onClick={() => {
              onReport(review.id);
              setOpenMenu(false);
            }}
            className="w-full text-left px-4 py-2 hover:bg-[#2a2a2a] text-sm text-red-400 flex items-center gap-2"
          >
            <Flag size={14} /> Report
          </button>
        </div>
      )}

      <div className="flex items-center mb-4">

      <Link to={`/users/${review.user_id}`} className="flex items-center gap-2 hover:underline">

        <img
          src={review.avatar || "https://randomuser.me/api/portraits/lego/1.jpg"}
          alt={review.username}
          className="w-12 h-12 rounded-full object-cover mr-4 border border-yellow-500"
        />
        </Link>
        <div>
          <h3 className="font-semibold text-lg">{review.username}</h3>

          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                size={20}
                className={`${
                  i <= review.rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-500"
                }`}
              />
            ))}
            <span className="ml-2 text-sm text-gray-400">
              {review.rating}/5
            </span>
          </div>
        </div>
      </div>

      <p className="mb-3">{review.review}</p>
      <div className="text-sm text-gray-400 mb-2">
        Reviewed on {new Date(review.created_at).toLocaleDateString()}
      </div>

      <button
        onClick={() => onHelpful(review.id)}
        disabled={isVoted}
        className={`flex items-center gap-2 text-sm ${
          isVoted ? "text-yellow-400" : "text-gray-400 hover:text-yellow-300"
        }`}
      >
        <ThumbsUp
          className={`w-5 h-5 ${isVoted ? "fill-yellow-400 text-yellow-400" : ""}`}
        />
        {review.helpful_count || 0} Helpful
      </button>
    </div>
  );
}
