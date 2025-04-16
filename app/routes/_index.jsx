import { useEffect, useState } from "react";
import HeroSlider from "../components/HeroSlider";
import Navbar from "../components/nav";
import Footer from "../components/footer";
import { PlusCircle, ChevronRight, ThumbsUp } from "lucide-react";
import CarouselSection from "../components/CarouselSection";
import HybridRecommendations from "../components/recommendations/HybridRecommendations";
import CollaborativeRecs from "../components/recommendations/CollaborativeRecs";
import ContentBasedRecs from "../components/recommendations/ContentBasedRecs";

export const meta = ({ data }) => {
  return [
    { title: data?.user ? `Welcome, ${data.user.username}` : "CMBD" },
    { name: "description", content: "Discover movies, rate, and review!" },
  ];
};

export default function Index() {
  const [popularPicks, setPopularPicks] = useState([]);
  const [communityPicks, setCommunityPicks] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularReviews, setPopularReviews] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  
    
      
    const fetchAll = async () => {
      try {
        const [trending, popular, community, reviews] = await Promise.all([
          fetch(`/api/movies?sort=trending&limit=10`).then((res) => res.json()),
          fetch(`/api/movies?sort=popular&limit=10`).then((res) => res.json()),
          fetch(`/api/movies?sort=community&limit=10`).then((res) => res.json()),
          fetch(`/api/reviews`).then((res) => res.json()),
        ]);
  
        setTrendingMovies(trending.movies || []);
        setPopularPicks(popular.movies || []);
        setCommunityPicks(community.movies || []);
  
        const sortedReviews = reviews
          .sort((a, b) => (b.helpful_count || 0) - (a.helpful_count || 0))
          .slice(0, 5);
        setPopularReviews(sortedReviews);
  
        if (token) {
          const profileRes = await fetch(`/api/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          }).then((res) => res.json());
  
          setWatchlist(profileRes.watchlist || []);
        }
      } catch (err) {
        console.error("Error fetching homepage data:", err);
      }
    };
  
    fetchAll();
  }, []);
  

  return (
    <div className="relative z-0 min-h-screen w-full flex flex-col justify-center items-center bg-[#121212]">
      <Navbar />
      <HeroSlider />

      {/* Trending */}
      <div className="w-full px-6 md:px-10 py-12">
        <h2 className="text-2xl text-white font-bold mb-6">What's New</h2>
        <CarouselSection items={trendingMovies} sectionId="trending" />
      </div>

      {/* Community Picks */}
      <div className="w-full px-6 md:px-10 py-12">
        <h2 className="text-2xl text-white font-bold mb-6">
          Top Community Picks
        </h2>
        <CarouselSection items={communityPicks} sectionId="community" />
      </div>

      {/* Hybrid / Collaborative / Content-Based */}
      {isLoggedIn && <HybridRecommendations />}
      {isLoggedIn && <CollaborativeRecs />}
      {isLoggedIn && <ContentBasedRecs />}

      {/* Guest Picks */}
      {!isLoggedIn && (
        <div className="w-full px-6 md:px-10 py-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl text-white font-bold">Picks</h2>
            <a href="/moviesPage" title="Explore more popular movies">
              <ChevronRight className="w-5 h-5 text-yellow-400 hover:text-yellow-300" />
            </a>
          </div>
          <p className="text-sm text-gray-400 mb-4">
            Sign in to get personalized recommendations.
          </p>
          <CarouselSection items={popularPicks} sectionId="guest-picks" />
        </div>
      )}

      {/* Watchlist */}
      <div className="w-full px-6 md:px-10 py-12">
        <h2 className="text-2xl text-white font-bold mb-6">Your Watchlist</h2>
        {isLoggedIn ? (
          watchlist.length > 0 ? (
            <CarouselSection items={watchlist} sectionId="watchlist" />
          ) : (
            <p className="text-gray-400 text-sm italic">
              No movies in your watchlist yet.
            </p>
          )
        ) : (
          <div className="text-center mt-8 bg-[#1a1a1a] py-12 px-6 rounded shadow-lg">
            <div className="flex justify-center text-10xl mb-4 text-white">
              <PlusCircle />
            </div>
            <h3 className="text-white text-lg font-semibold mb-2">
              Sign in to access your Watchlist
            </h3>
            <p className="text-gray-400 mb-6">
              Save movies to keep track of what you want to watch.
            </p>
            <a
              href="/login"
              className="inline-block bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 py-2 rounded-full transition"
            >
              Sign in to CMBD
            </a>
          </div>
        )}
      </div>

      {/* Popular Reviews */}
      <div className="w-full px-6 md:px-10 py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl text-white font-bold">Popular Reviews</h2>
          <a
            href="/popularReviews"
            className="text-sm text-yellow-400 hover:underline"
          >
            Read More Reviews →
          </a>
        </div>
        {popularReviews.length === 0 ? (
          <p className="text-gray-400 italic">No popular reviews yet.</p>
        ) : (
          <div className="space-y-6">
            {popularReviews.map((review) => (
              <div
                key={review.id}
                className="group flex items-start gap-4 bg-[#1a1a1a] rounded-lg p-4 shadow border border-gray-700 hover:border-yellow-500 transition relative"
              >
                <a
                  href={`/reviews/${review.movie_id}`}
                  className="absolute inset-0 z-10"
                />
                <img
                  src={review.poster_url || "/godzilla.jpeg"}
                  alt={review.movie_title}
                  className="w-20 h-28 object-cover rounded-lg shadow z-0"
                  onError={(e) => (e.target.src = "/godzilla.jpeg")}
                />
                <div className="flex-1 z-0">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white group-hover:text-yellow-400">
                      {review.movie_title}
                    </h3>
                    <span className="text-yellow-400 font-semibold text-sm">
                      {review.rating} ★
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 mt-1 mb-2">
                    {review.review.length > 250
                      ? `${review.review.slice(0, 250)}...`
                      : review.review}
                  </p>
                  <div className="flex justify-between text-xs text-gray-500 mb-2">
                    <span>by {review.username}</span>
                    <span>
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <button
                    disabled={!!review.votedHelpful}
                    onClick={async (e) => {
                      e.preventDefault();
                      const token = localStorage.getItem("token");
                      if (!token)
                        return alert("Please log in to vote helpful.");
                      try {
                        const res = await fetch(
                          `http://localhost:5000/api/reviews/${review.id}/helpful`,
                          {
                            method: "POST",
                            headers: { Authorization: `Bearer ${token}` },
                          }
                        );
                        if (res.ok) {
                          setPopularReviews((prev) =>
                            prev.map((r) =>
                              r.id === review.id
                                ? {
                                    ...r,
                                    helpful_count: (r.helpful_count || 0) + 1,
                                    votedHelpful: true,
                                  }
                                : r
                            )
                          );
                        }
                      } catch (err) {
                        console.error("Helpful vote failed:", err);
                      }
                    }}
                    className={`mt-1 inline-flex items-center gap-1 text-xs font-medium z-10 relative ${
                      review.votedHelpful
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-yellow-400 hover:text-yellow-300"
                    }`}
                  >
                    <ThumbsUp className="w-4 h-4" /> {review.helpful_count || 0}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
