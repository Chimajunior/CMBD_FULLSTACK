import { Form, Link } from "@remix-run/react";
import { Search, Loader2, X } from "lucide-react";

export default function SearchBar({
  query,
  setQuery,
  results,
  setResults,
  loading,
  highlighted,
  setHighlighted,
  handleSearch,
  handleKeyDown,
  highlightMatch,
}) {
  const showResults = query && results.length > 0;

  const SuggestionDropdown = () => (
    <div className="absolute w-full mt-2 bg-white rounded shadow-lg z-50 max-h-96 overflow-y-auto text-black">
      {results.length > 0 ? (
        results.map((movie, i) => (
          <Link
            key={movie.id}
            to={`/movies/${movie.id}`}
            onClick={() => setQuery("")}
            className={`flex items-center gap-3 px-3 py-2 hover:bg-yellow-100 ${
              i === highlighted ? "bg-yellow-200" : ""
            }`}
          >
            <img
              src={movie.poster_url}
              alt={movie.title}
              className="w-10 h-14 object-cover rounded shadow"
            />
            <div>
              <p
                className="font-medium"
                dangerouslySetInnerHTML={{
                  __html: highlightMatch(movie.title),
                }}
              />
              <p className="text-xs text-gray-500">{movie.genre}</p>
            </div>
          </Link>
        ))
      ) : (
        <p className="text-sm text-center text-gray-500 px-3 py-4">
          No results found.
        </p>
      )}
    </div>
  );

  return (
    <Form
      action="/search"
      method="get"
      className="relative w-full max-w-md px-4 md:px-0 pb-3 md:pb-0"
      onSubmit={() => {
        setResults([]);
        setHighlighted(-1);
      }}
    >
      <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-yellow-700 pointer-events-none" />
      <input
        type="search"
        name="q"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search movies..."
        className="w-full pl-10 pr-10 py-2 rounded-lg bg-[#FFE38C] text-black placeholder-yellow-700 font-medium outline-none focus:ring-2 focus:ring-yellow-400"
      />
      {loading && (
        <Loader2 className="absolute right-6 top-1/2 transform -translate-y-1/2 animate-spin text-yellow-700" />
      )}
      {query && !loading && (
        <button
          type="button"
          onClick={() => setQuery("")}
          className="absolute right-6 top-1/2 transform -translate-y-1/2 text-yellow-800"
        >
          <X size={18} />
        </button>
      )}
      {showResults && <SuggestionDropdown />}
    </Form>
  );
}
