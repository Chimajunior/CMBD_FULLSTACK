import { Link } from "@remix-run/react";

export default function MovieCardSmall({ id, title, poster_url, genre }) {
  return (
    <Link
      to={`/movies/${id}`}
      className="flex items-center gap-3 px-3 py-2 hover:bg-[#2a2a2a] transition rounded"
    >
      <img
        src={poster_url || "/godzilla.jpeg"}
        alt={title}
        className="w-10 h-14 object-cover rounded shadow border border-gray-700"
      />
      <div className="flex flex-col overflow-hidden">
        <p className="text-sm font-medium text-white truncate">{title}</p>
        <p className="text-xs text-gray-400 truncate">{genre}</p>
      </div>
    </Link>
  );
}
