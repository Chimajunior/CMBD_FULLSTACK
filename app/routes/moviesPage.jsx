import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "@remix-run/react";
import MovieCard from "../components/MovieCard";
import Navbar from "../components/nav";
import Footer from "../components/footer";
import { ChevronDown, Search } from "lucide-react";


const genreOptions = [
  "",
  "Action",
  "Comedy",
  "Drama",
  "Horror",
  "Sci-Fi",
  "Romance",
];
const yearOptions = ["", "2025", "2024", "2023", "2022", "2021", "2020"];

export default function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const limit = 10;

  const initialSortBy = searchParams.get("sortBy") || "release_date";
  const initialOrder = searchParams.get("order") || "DESC";
  const initialGenre = searchParams.get("genre") || "";
  const initialYear = searchParams.get("year") || "";
  const initialQuery = searchParams.get("title") || "";

  const [sortBy, setSortBy] = useState(initialSortBy);
  const [order, setOrder] = useState(initialOrder);
  const [genre, setGenre] = useState(initialGenre);
  const [year, setYear] = useState(initialYear);
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const API_BASE =
        typeof window !== "undefined"
          ? window.ENV?.VITE_API_URL
          : process.env.VITE_API_URL || "http://localhost:5000";
              console.log("API Base:", API_BASE);
    
        const params = new URLSearchParams({ page, limit, sortBy, order });
        if (genre) params.append("genre", genre);
        if (year) params.append("year", year);
        if (query) params.append("title", query);
    
        const res = await fetch(
          `${API_BASE}/api/movies?${params.toString()}`
        );
        const data = await res.json();
        if (data.movies && Array.isArray(data.movies)) {
          setMovies((prev) =>
            page === 1 ? data.movies : [...prev, ...data.movies]
          );
          setHasMore(!(data.movies.length < limit || page >= data.totalPages));
        } else {
          setMovies([]);
          setHasMore(false);
        }
      } catch (err) {
        console.error("Failed to fetch movies:", err);
        setMovies([]);
        setHasMore(false);
      }
    };

    fetchMovies();
  }, [page, sortBy, order, genre, year, query]);

  const updateParams = useCallback(
    (updates) => {
      const updatedParams = {
        sortBy,
        order,
        genre,
        year,
        title: query,
        ...updates,
      };
      setSearchParams(updatedParams);
      if (updates.sortBy !== undefined) setSortBy(updates.sortBy);
      if (updates.order !== undefined) setOrder(updates.order);
      if (updates.genre !== undefined) setGenre(updates.genre);
      if (updates.year !== undefined) setYear(updates.year);
      if (updates.title !== undefined) setQuery(updates.title);
      setPage(1);
      setHasMore(true);
    },
    [sortBy, order, genre, year, query, setSearchParams]
  );

  const handleDebouncedSearch = (value) => {
    clearTimeout(debounceTimeout);
    const timeout = setTimeout(() => {
      updateParams({ title: value });
    }, 500);
    setDebounceTimeout(timeout);
  };

  const handleResetFilters = () => {
    setSearchParams({});
    setSortBy("release_date");
    setOrder("DESC");
    setGenre("");
    setYear("");
    setQuery("");
    setMovies([]);
    setPage(1);
    setHasMore(true);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-[#121212] text-white">
      <Navbar />
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-2xl font-bold mb-6 mt-4">All Movies</h2>

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <div className="flex gap-4 flex-wrap w-full lg:w-auto">
            {[
              {
                label: "Sort By",
                value: sortBy,
                onChange: (e) => updateParams({ sortBy: e.target.value }),
                options: [
                  { label: "Newest", value: "release_date" },
                  { label: "Top Rated", value: "avg_rating" },
                  { label: "Popular", value: "popularity" }, 
                  { label: "A-Z", value: "title" },
                ],
              },
              {
                label: "Order",
                value: order,
                onChange: (e) => updateParams({ order: e.target.value }),
                options: [
                  { label: "Descending", value: "DESC" },
                  { label: "Ascending", value: "ASC" },
                ],
              },
              {
                label: "Genre",
                value: genre,
                onChange: (e) => updateParams({ genre: e.target.value }),
                options: genreOptions.map((g) => ({
                  label: g || "All Genres",
                  value: g,
                })),
              },
              {
                label: "Year",
                value: year,
                onChange: (e) => updateParams({ year: e.target.value }),
                options: yearOptions.map((y) => ({
                  label: y || "All Years",
                  value: y,
                })),
              },
            ].map((select, idx) => (
              <div className="relative" key={idx}>
                <select
                  value={select.value}
                  onChange={select.onChange}
                  className="bg-[#272727] text-white px-4 py-2 rounded-md border border-gray-500 appearance-none pr-10 hover:border-yellow-500"
                >
                  {select.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-300 pointer-events-none"
                  size={16}
                />
              </div>
            ))}

            <button
              onClick={handleResetFilters}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Reset Filters
            </button>
          </div>

          {/* Search input */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search title..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                handleDebouncedSearch(e.target.value);
              }}
              className="bg-[#272727] text-white px-4 py-2 pl-10 rounded-md border border-gray-500 w-full"
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
          </div>
        </div>

        {movies.length === 0 ? (
          <p className="text-center text-gray-400 mt-12">No movies found.</p>
        ) : (
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-5 gap-6">
{movies.map((movie) => (
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
        )}

        {hasMore && (
          <div className="flex justify-center mt-10">
            <button
              onClick={() => setPage((prevPage) => prevPage + 1)}
              className="px-6 py-2 bg-[#B8860B] text-white rounded-md hover:bg-yellow-700"
            >
              Load More
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
