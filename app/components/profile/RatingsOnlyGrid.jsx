import MovieCard from "../MovieCard";

export default function RatingsOnlyGrid({ movies = [] }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Ratings</h2>

      {movies.length === 0 ? (
        <p className="text-gray-400 italic">No ratings-only entries yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              {...movie}
              avg_rating={movie.avg_rating || movie.rating || 0} // fallback to rating if avg not available
              user_rating={movie.rating}
            />
          ))}
        </div>
      )}
    </div>
  );
}
