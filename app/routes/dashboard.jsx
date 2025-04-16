import { useEffect, useState } from "react";
import { useNavigate } from "@remix-run/react";

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../components/ui/tabs";
import { PlusCircle } from "lucide-react";
import Navbar from "../components/dashboard/admin-navbar";
import MovieModal from "../components/dashboard/MovieModal";
import MovieCard from "../components/dashboard/MovieCard";
import ReviewsTab from "../components/dashboard/ReviewsTab";
import UsersTab from "../components/dashboard/UsersTab";
import { toast } from "sonner";

export default function AdminDashboard() {
  const [token, setToken] = useState(null);
  const [movies, setMovies] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState([]);

  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const navigate = useNavigate();


// const API_BASE =
//     typeof window !== "undefined"
//       ? window.ENV?.VITE_API_URL
//       : process.env.VITE_API_URL || "http://localhost:5000";
    
  // Load token
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("token");
      setToken(stored);
    }
  }, []);



  useEffect(() => {
    const stored = localStorage.getItem("token");
    if (!stored) return navigate("/login");

    try {
      const payload = JSON.parse(atob(stored.split(".")[1]));
      if (payload.role !== "admin") {
        toast.error("Access denied");
        navigate("/");
      }
    } catch (err) {
      console.error("Invalid token", err);
      navigate("/login");
    }
  }, []);



  // Search filtering
  useEffect(() => {
    const query = search.toLowerCase();
    const results = movies.filter((m) => m.title.toLowerCase().includes(query));
    setFiltered(results);
    setCurrentPage(1);
  }, [search, movies]);

  const handleOpenAdd = () => {
    setEditingMovie(null);
    setShowModal(true);
  };

  const handleEdit = (movie) => {
    setEditingMovie(movie);
    setShowModal(true);
  };



  const handleSubmit = (movie, isEdit = false) => {
    if (isEdit) {
      setMovies((prev) => prev.map((m) => (m.id === movie.id ? movie : m)));
    } else {
      setMovies((prev) => [movie, ...prev]);
    }
    setShowModal(false);
  };



// Fetch movies, users, flagged reviews
useEffect(() => {
    if (!token) return;
  
    fetch(`/api/movies`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setMovies(data.movies || []))
      .catch(() => toast.error("Failed to load movies"));
  
    fetch(`/api/users`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUsers(data || []))
      .catch(() => toast.error("Failed to load users"));
  
    fetchFlaggedReviews();
  }, [token]);
  
  const fetchFlaggedReviews = () => {
    fetch(`/api/reviews/flagged/all`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Network response not ok");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setReviews(data);
        } else {
          console.warn("Expected array of reviews but got:", data);
          setReviews([]);
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        toast.error("Failed to load reviews");
      });
  };

//   Delete Movie
  const handleDelete = async (id) => {
    if (!window.confirm("Delete movie?")) return;
    try {
      await fetch(`/api/movies/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setMovies((prev) => prev.filter((m) => m.id !== id));
      toast.success("Movie deleted.");
    } catch {
      toast.error("Error deleting movie");
    }
  };
  
//   Approve Review
  const handleApproveReview = async (id) => {
    try {
      const res = await fetch(`/api/reviews/${id}/approve`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (res.ok) {
        setReviews((prev) =>
          prev.map((r) => (r.id === id ? { ...r, flagged: false } : r))
        );
        toast.success("Review approved");
      }
    } catch {
      toast.error("Failed to approve review");
    }
  };

//   delete review
  const handleDeleteReview = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await fetch(`/api/reviews/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setReviews((prev) => prev.filter((r) => r.id !== id));
      toast.success("Review deleted.");
    } catch {
      toast.error("Failed to delete review");
    }
  };

//   Delete User
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await fetch(`/api/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((prev) => prev.filter((u) => u.id !== id));
      toast.success("User deleted.");
    } catch {
      toast.error("Failed to delete user");
    }
  };
  
  
  

  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <div className="bg-[#121212] min-h-screen text-white">
      <Navbar />
      <div className="max-w-6xl mx-auto py-20 px-6">
        <h1 className="text-4xl font-bold mb-10 text-yellow-400">
          Admin Dashboard
        </h1>

        <Tabs defaultValue="movies" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="movies">Movies</TabsTrigger>
            <TabsTrigger value="reviews">Moderate Reviews</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          {/* 🎬 Movies */}
          <TabsContent value="movies">
            <div className="flex justify-between items-center mb-6">
              <input
                className="bg-[#1e1e1e] text-sm text-white border border-gray-600 px-4 py-2 rounded w-full max-w-xs"
                placeholder="Search movies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                onClick={handleOpenAdd}
                className="ml-4 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-4 py-2 rounded flex items-center gap-2"
              >
                <PlusCircle className="w-5 h-5" /> Add Movie
              </button>
            </div>

            {paginated.length === 0 ? (
              <p className="text-gray-400 italic">No movies found.</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {paginated.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    onEdit={() => handleEdit(movie)}
                    onDelete={() => handleDelete(movie.id)}
                  />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center mt-6 space-x-2">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 rounded ${
                      i + 1 === currentPage
                        ? "bg-yellow-500 text-black"
                        : "bg-[#1e1e1e] text-white border border-gray-600"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </TabsContent>

          {/*  Reviews */}
          <TabsContent value="reviews">
            <div className="flex justify-end mb-4">
              <button
                onClick={fetchFlaggedReviews}
                className="text-sm text-yellow-400 hover:text-yellow-300"
              >
                🔄 Refresh Reviews
              </button>
            </div>
            <ReviewsTab
              reviews={reviews}
              token={token}
              onApprove={handleApproveReview}
              onDelete={handleDeleteReview}
            />
          </TabsContent>

          {/*  Users */}
          <TabsContent value="users">
            <UsersTab users={users} onDelete={handleDeleteUser} />
          </TabsContent>
        </Tabs>
      </div>

      <MovieModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        editingMovie={editingMovie}
        token={token}
      />
    </div>
  );
}

