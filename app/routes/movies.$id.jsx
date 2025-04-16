import { json } from "@remix-run/node";
import { useLoaderData, useParams } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import Navbar from "../components/nav";
import Footer from "../components/footer";
import MovieCard from "../components/MovieCard";
import MovieReviewSection from "../components/MovieReview";
import ReviewForm from "../components/ReviewForm";
import RatingModal from "../components/RatingModal";
import {
  Star,
  Plus,
  X,
  CheckCircle,
  PlusCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// const API_BASE =
//   typeof window !== "undefined"
//     ? window.ENV?.VITE_API_URL
//     : process.env.VITE_API_URL || "http://localhost:5000";


export const loader = async ({ params, request }) => {
  const token = request.headers.get("Authorization");
  const origin = new URL(request.url).origin;

  // Movie details
  const res = await fetch(`${origin}/api/movies/${params.id}`);
  if (!res.ok) throw new Response("Movie not found", { status: 404 });
  const movie = await res.json();

  // Reviews
  const reviewRes = await fetch(`${origin}/api/reviews/${params.id}`);
  const reviews = await reviewRes.json();

  // Similar movies
  const similarRes = await fetch(`${origin}/api/movies/${params.id}/similar`);
  const similar = await similarRes.json();

  let myRating = 0;

  if (token) {
    try {
      const profileRes = await fetch(`${origin}/api/profile`, {
        headers: { Authorization: token },
      });
      const profileData = await profileRes.json();

      const foundReview = profileData.reviews?.find(
        (r) => r.movie_id === movie.id
      );
      const foundRatingOnly = profileData.rating_only?.find(
        (r) => r.id === movie.id
      );

      if (foundReview) myRating = foundReview.rating;
      else if (foundRatingOnly) myRating = foundRatingOnly.rating;
    } catch (_) {
    }
  }

  return json({ ...movie, reviews, similar, myRating });
};


export default function MovieDetail() {
  const initialMovie = useLoaderData();
  const { id } = useParams();
  const scrollRef = useRef(null);
  const [userId, setUserId] = useState(null);

  const [movieData, setMovieData] = useState(initialMovie);
  const [myRating, setMyRating] = useState(initialMovie.myRating || 0);
  const [isPosterZoomed, setIsPosterZoomed] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [ratingOpen, setRatingOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [showReviews, setShowReviews] = useState(initialMovie.reviews || []);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await fetch(`/api/movies/${id}`);
        const movie = await res.json();

        const reviewRes = await fetch(`/api/reviews/${id}`);
        const reviews = await reviewRes.json();

        const similarRes = await fetch(`/api/movies/${id}/similar`);
        const similar = await similarRes.json();

        const token = localStorage.getItem("token");
        let ratingFromProfile = 0;

        if (token) {
          const profileRes = await fetch(`/api/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const profileData = await profileRes.json();

          const foundReview = profileData.reviews?.find(
            (r) => r.movie_id === movie.id
          );
          const foundRatingOnly = profileData.rating_only?.find(
            (r) => r.id === movie.id
          );

          if (foundReview) ratingFromProfile = foundReview.rating;
          else if (foundRatingOnly) ratingFromProfile = foundRatingOnly.rating;

          setInWatchlist(profileData.watchlist?.some((m) => m.id === movie.id));
        }

        setMyRating(ratingFromProfile);

        setMovieData({ ...movie, reviews, similar });
        setShowReviews(reviews);
      } catch (err) {
        console.error("Failed to reload movie:", err);
      }
    };

    fetchMovie();
  }, [id]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < now) {
        localStorage.removeItem("token");
        setUserId(null);
      } else {
        setUserId(payload.id);
      }
    } catch {
      setUserId(null);
    }
  }, []);

  const toggleWatchlist = async () => {
    const token = localStorage.getItem("token");
    if (!token) return (window.location.href = "/login");

    try {
      const res = await fetch(`/api/watchlist/toggle`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ movie_id: movieData.id }),
      });
      const result = await res.json();
      setInWatchlist(result.inWatchlist);
      showToast(
        result.inWatchlist ? "Added to Watchlist" : "Removed from Watchlist"
      );
    } catch (err) {
      console.error("Watchlist toggle failed", err);
    }
  };

  const fetchLatestMovie = async () => {
    const res = await fetch(`/api/movies/${movieData.id}`);
    const updated = await res.json();
    setMovieData((prev) => ({ ...prev, avg_rating: updated.avg_rating }));
  };

  const fetchLatestReviews = async () => {
    try {
      const res = await fetch(`/api/reviews/${movieData.id}`);
      const data = await res.json();
      setShowReviews(data);
    } catch (err) {
      console.error("Failed to fetch updated reviews:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <Navbar />
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-3 rounded shadow-lg flex items-center gap-2">
          {toast}
          <button onClick={() => setToast("")}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Layout */}
      <div className="max-w-7xl mx-auto pt-28 px-4 sm:px-6 lg:px-10 flex flex-col lg:flex-row gap-12 items-start">
        {/* Poster */}
        <div className="w-full sm:max-w-[300px] relative">
          <div className="relative w-fit mx-auto sm:mx-0">
            <img
              src={movieData.poster_url || "/godzilla.jpeg"}
              alt={movieData.title}
              onClick={() => setIsPosterZoomed(true)}
              onError={(e) => (e.target.src = "/godzilla.jpeg")}
              className="w-full max-w-[280px] rounded shadow-lg cursor-zoom-in object-cover"
            />
            <button
              onClick={toggleWatchlist}
              className="absolute top-2 left-2 bg-black/70 p-1 rounded-full hover:scale-105 transition z-10"
            >
              {inWatchlist ? (
                <CheckCircle className="text-yellow-400 w-5 h-5" />
              ) : (
                <PlusCircle className="text-white w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
                {movieData.title}
              </h1>
              <span className="text-white/70 text-xl">
                ({new Date(movieData.release_date).getFullYear()})
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs text-white/50 font-medium px-1">
                <span>Avg Rating</span>
                <span>Your Rating</span>
              </div>

              <div className="flex items-center gap-6 mt-1">
                <div className="flex items-center text-yellow-400 font-semibold gap-1">
                  <Star className="fill-yellow-400 w-5 h-5" />
                  <span className="text-lg">
                    {Number(movieData.avg_rating).toFixed(1)}
                  </span>
                  <span className="text-sm text-white/50">/5</span>
                </div>

                <button
                  onClick={() => {
                    const token = localStorage.getItem("token");
                    if (!token) return (window.location.href = "/login");
                    setRatingOpen(true);
                  }}
                  className="text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium"
                >
                  <Star
                    className={`w-5 h-5 ${
                      myRating > 0
                        ? "fill-blue-400 text-blue-400"
                        : "text-blue-400"
                    }`}
                  />
                  {myRating > 0 ? `${myRating}/5` : "Rate"}
                </button>
              </div>
            </div>
          </div>

          <ul className="text-base leading-relaxed space-y-4 mt-4">
            <li>
              <strong>Genres:</strong> {movieData.genre}
            </li>
            <li>
              <strong>Cast:</strong> {movieData.cast}
            </li>
            <li>
              <strong>Release:</strong>{" "}
              {new Date(movieData.release_date).toLocaleDateString()}
            </li>
            <li>
              <strong>Description:</strong> {movieData.description}
            </li>
          </ul>

          <div className="mt-2">
            {movieData.total_ratings > 0 || myRating > 0 ? (
              <p className="text-white/60 text-sm mt-1 flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                Rated {Number(movieData.avg_rating).toFixed(1)} by{" "}
                {movieData.total_ratings} user
                {movieData.total_ratings === 1 ? "" : "s"}
              </p>
            ) : (
              <p className="text-white/60 text-sm mt-1 italic">Not rated yet</p>
            )}
            <p className="text-gray-400 text-sm italic">
              Already watched? Leave a review or add to your watchlist!
            </p>
          </div>
        </div>
      </div>

      <RatingModal
        isOpen={ratingOpen}
        onClose={() => setRatingOpen(false)}
        movie={{ id: movieData.id, title: movieData.title }}
        initialRating={myRating}
        onRate={(newRating) => {
          setMyRating(newRating);
          fetchLatestMovie();
          fetchLatestReviews();
        }}
      />

      {isPosterZoomed && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="relative max-w-3xl w-full">
            <button
              onClick={() => setIsPosterZoomed(false)}
              className="absolute top-2 right-2 bg-black/80 text-white p-1 rounded-full z-50"
            >
              <X />
            </button>
            <img
              src={movieData.poster_url || "/godzilla.jpeg"}
              alt="Zoomed Poster"
              className="w-full max-h-[90vh] object-contain rounded-lg shadow-xl transition-transform duration-300 hover:scale-105"
            />
          </div>
        </div>
      )}

      <div className="w-full px-4 sm:px-10 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h2 className="text-2xl font-bold">
              User Reviews
              {showReviews.length > 0 && (
                <span className="text-white/60 text-base ml-2">
                  ({showReviews.length})
                </span>
              )}
            </h2>
            {/* Show the button if:
              - The user is logged in
               - AND has NOT submitted a non-empty review */}
            {!userId ? (
              <button
                onClick={() => (window.location.href = "/login")}
                className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 font-semibold rounded flex items-center gap-2"
              >
                <Plus size={18} /> Sign in to Review
              </button>
            ) : (
              !showReviews.some(
                (r) =>
                  r.user_id === userId &&
                  typeof r.review === "string" &&
                  r.review.trim().length > 0
              ) && (
                <button
                  onClick={() => setShowForm((prev) => !prev)}
                  className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 font-semibold rounded flex items-center gap-2"
                >
                  <Plus size={18} /> Make a Review
                </button>
              )
            )}
          </div>

          {showReviews.length > 0 ? (
            <MovieReviewSection reviews={showReviews} movieId={movieData.id} />
          ) : (
            <p className="text-gray-400 italic mb-6">No reviews yet.</p>
          )}

          {showForm && (
            <div className="mt-6 bg-[#1a1a1a] p-6 rounded-lg">
              <ReviewForm
                movieId={movieData.id}
                onReviewSubmit={() => {
                  setShowForm(false);
                  fetchLatestReviews();
                }}
                initialRating={myRating}
              />
            </div>
          )}
        </div>
      </div>

      {movieData.similar?.length > 0 && (
        <div className="w-full px-4 sm:px-6 py-12 bg-[#121212]">
          <div className="max-w-6xl mx-auto relative">
            <h2 className="text-2xl font-bold mb-6">More Like This</h2>
            <button
              onClick={() =>
                scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" })
              }
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 text-white p-2 rounded-full hover:bg-white hover:text-black"
            >
              <ChevronLeft />
            </button>
            <button
              onClick={() =>
                scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" })
              }
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 text-white p-2 rounded-full hover:bg-white hover:text-black"
            >
              <ChevronRight />
            </button>

            <div
              ref={scrollRef}
              className="overflow-x-auto scroll-smooth hide-scrollbar pb-2"
            >
              <div className="flex gap-6 px-2">
                {movieData.similar.map((m) => (
                  <div
                    key={m.id}
                    className="w-[180px] sm:w-[200px] flex-shrink-0"
                  >
                    <MovieCard
                      id={m.id}
                      title={m.title}
                      imageUrl={m.poster_url || "/godzilla.jpeg"}
                      releaseDate={m.release_date}
                      rating={m.avg_rating}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
