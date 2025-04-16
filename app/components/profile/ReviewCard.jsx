import { useState } from "react";
import { StarIcon, Pencil, Trash2 } from "lucide-react";

export default function ReviewCard({ review, onSave, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [tempReview, setTempReview] = useState(review.review);
  const [tempRating, setTempRating] = useState(review.rating);

  const handleSave = () => {
    onSave({ ...review, review: tempReview, rating: tempRating });
    setEditing(false);
  };

  const renderStars = () =>
    [...Array(5)].map((_, i) => (
      <StarIcon
        key={i}
        className={`w-5 h-5 cursor-pointer ${
          i < tempRating ?  "fill-yellow-400 text-yellow-400"
                    : "text-gray-500"
        }`}
        onClick={() => editing && setTempRating(i + 1)}
      />
    ));

  return (
    <div className="bg-[#1f1f1f] p-4 rounded-lg shadow space-y-2">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-semibold text-white">{review.movie_title}</p>
          <div className="flex items-center gap-1">
            {renderStars()}
            <span className="text-sm text-gray-400">{tempRating}/5</span>
          </div>
        </div>
        <div className="flex gap-3">
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              title="Edit"
              className="text-yellow-400 hover:text-yellow-300"
            >
              <Pencil className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => onDelete(review.id)}
            title="Delete"
            className="text-red-500 hover:text-red-400"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {editing ? (
        <div className="space-y-2">
          <textarea
            className="w-full px-3 py-2 text-sm rounded bg-[#2a2a2a] text-white"
            value={tempReview}
            onChange={(e) => setTempReview(e.target.value)}
          />
          <button
            className="px-4 py-1 bg-yellow-500 text-black text-sm font-semibold rounded"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      ) : (
        <p className="text-sm text-gray-300 italic">{review.review}</p>
      )}
    </div>
  );
}
