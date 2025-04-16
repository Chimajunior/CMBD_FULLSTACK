import { useState, useRef } from "react";
import { useNavigate } from "@remix-run/react";

export default function useSearchSuggestions(apiBase) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [highlighted, setHighlighted] = useState(-1);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);
  const navigate = useNavigate();

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && results[highlighted]) {
      e.preventDefault();
      navigate(`/movies/${results[highlighted].id}`);
      setQuery("");
      setResults([]);
    }
  };

  const handleSearch = (val) => {
    setQuery(val);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!val.trim()) return setResults([]);

    setLoading(true);
    debounceRef.current = setTimeout(() => {
      fetch(`${apiBase}/api/search/suggestions?q=${encodeURIComponent(val)}`)
        .then((res) => res.json())
        .then((data) => setResults(data || []))
        .finally(() => setLoading(false));
    }, 300);
  };

  return {
    query,
    setQuery,
    results,
    loading,
    highlighted,
    setHighlighted,
    handleSearch,
    handleKeyDown,
  };
}
