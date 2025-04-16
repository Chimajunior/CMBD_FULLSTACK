import React from "react";

export default function GenreTags({ reviews = [] }) {

  // Extract and deduplicate genres
  const genres = Array.from(
    new Set(
      reviews
        .flatMap((r) =>
          typeof r.genre === "string" ? r.genre.split(",") : []
        )
        .map((g) => g.trim())
        .filter(Boolean)
    )
  );

  return (
    <div className="bg-[#1f1f1f] p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Genres Rated</h2>
      {genres.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {genres.map((genre) => (
            <span
              key={genre}
              className="text-sm px-3 py-1 bg-yellow-700/80 hover:bg-yellow-600 text-white rounded-full shadow"
            >
              {genre}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 italic">No genres yet.</p>
      )}
    </div>
  );
}
