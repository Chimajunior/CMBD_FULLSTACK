import { Star } from "lucide-react";

export default function PublicReviewCard({ review }) {
  return (
    <div className="bg-[#1a1a1a] border border-gray-700 p-4 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <span className="text-yellow-400 font-semibold flex items-center gap-1">
          <Star className="w-4 h-4 fill-yellow-400" />
          {review.rating}/5
        </span>
        <span className="text-xs text-gray-400">
          {new Date(review.created_at).toLocaleDateString()}
        </span>
      </div>
      <p className="text-sm">{review.review}</p>
    </div>
  );
}
