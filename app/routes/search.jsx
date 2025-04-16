import { json } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import Navbar from "../components/nav";
import Footer from "../components/footer";
import MovieCard from "../components/MovieCard"; 



export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const query = url.searchParams.get("q");

  if (!query) {
    return json({ results: [], error: "No search query provided." });
  }

  // const API_BASE = process.env.VITE_API_URL || "http://localhost:5000" ; 

  const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
  const data = await res.json();

  if (!res.ok) {
    return json({ results: [], error: data.message || "Search failed." });
  }

  return json({ results: data });
};


export default function SearchPage() {
  const { results, error } = useLoaderData();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");

  return (
    <div className="min-h-screen bg-[#121212] text-white px-6">
      <Navbar />
      <div className="pt-24 pb-10">
        <h1 className="text-3xl font-bold mb-6">
          Search Results for: <span className="text-yellow-400">"{query}"</span>
        </h1>

        {error && <p className="text-red-500 mb-6">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {results.map((movie) => (
            <MovieCard
              key={movie.id}
              id={movie.id}
              title={movie.title}
              imageUrl={movie.poster_url}
              releaseDate={movie.release_date}
              rating={movie.avg_rating}
            />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
