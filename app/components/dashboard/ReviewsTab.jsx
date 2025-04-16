import { ShieldAlert } from "lucide-react";
import { toast } from "sonner";

export default function ReviewsTab({ reviews, token, onApprove, onDelete }) {
  if (reviews.length === 0) {
    return <p className="text-gray-400 italic">No reviews available.</p>;
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="p-4 bg-[#1e1e1e] rounded border border-gray-700">
          <div className="flex justify-between mb-2">
            <div className="text-yellow-300 font-semibold">{review.movie_title}</div>
            <div className="text-xs text-gray-500">
              {new Date(review.created_at).toLocaleString()}
            </div>
          </div>
          <p className="text-sm text-gray-300 italic mb-2">"{review.review}"</p>
          <div className="flex justify-between text-sm text-gray-400">
            <span>By: {review.username}</span>
            {review.flagged && (
              <span className="text-red-500 flex items-center gap-1 font-semibold">
                <ShieldAlert className="w-4 h-4" /> Flagged
              </span>
            )}
          </div>
          <div className="flex gap-4 mt-3">
            {review.flagged && (
              <button
                className="text-green-400 hover:text-green-300 text-sm"
                onClick={() => onApprove(review.id)}
              >
                ✅ Approve
              </button>
            )}
            <button
              className="text-red-500 hover:text-red-400 text-sm"
              onClick={() => onDelete(review.id)}
            >
              🗑 Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
