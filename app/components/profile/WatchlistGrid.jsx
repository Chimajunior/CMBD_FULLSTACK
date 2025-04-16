import MovieCard from "../MovieCard";

export default function WatchlistGrid({ movies = [] }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Your Watchlist</h2>

      {movies.length === 0 ? (
        <p className="text-gray-400 italic">No movies in your watchlist yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} {...movie} />
          ))}
        </div>
      )}
    </div>
  );
}
