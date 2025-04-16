import { Pencil, Trash2 } from "lucide-react";

export default function MovieCard({ movie, onEdit, onDelete }) {
  return (
    <div className="p-4 bg-[#1e1e1e] rounded shadow-md">
      <div className="flex gap-4 items-start">
        <img
          src={movie.poster_url}
          className="w-20 h-28 object-cover rounded"
          alt={movie.title}
          onError={(e) => (e.target.src = "/fallback-poster.jpg")}
        />
        <div className="flex-1">
          <h3 className="text-xl font-semibold">{movie.title}</h3>
          <p className="text-gray-400 text-sm mb-2">{movie.genre}</p>
          <p className="text-gray-500 text-xs">
            Release: {new Date(movie.release_date).toLocaleDateString()}
          </p>
          <div className="flex gap-3 mt-3">
            <button
              className="text-yellow-400 hover:text-yellow-300 text-sm flex items-center gap-1"
              onClick={onEdit}
            >
              <Pencil className="w-4 h-4" /> Edit
            </button>
            <button
              className="text-red-500 hover:text-red-400 text-sm flex items-center gap-1"
              onClick={onDelete}
            >
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
