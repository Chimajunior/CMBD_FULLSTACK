import { useEffect, useState } from "react";
import CarouselSection from "../CarouselSection";
import { Info } from "lucide-react";

export default function HybridRecommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
  
    const fetchHybrid = async () => {
      try {
        const API_BASE =
        typeof window !== "undefined"
          ? window.ENV?.VITE_API_URL
          : process.env.VITE_API_URL || "http://localhost:5000";
          
        const res = await fetch(`${API_BASE}/api/recommendations/hybrid`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        const data = await res.json();
        setRecommendations(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("Failed to load recommendations.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchHybrid();
  }, []);
  

  if (!localStorage.getItem("token")) return null;

  return (
    <div className="w-full px-6 md:px-10 py-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl text-white font-bold">Recommended for You</h2>
        <a href="/about/recommendations" title="How our hybrid system works">
          <Info className="w-5 h-5 text-yellow-400 hover:text-yellow-300" />
        </a>
      </div>
      {loading ? (
        <p className="text-gray-400 italic text-sm">Loading recommendations...</p>
      ) : error ? (
        <p className="text-red-400 italic text-sm">{error}</p>
      ) : recommendations.length === 0 ? (
        <p className="text-gray-400 italic text-sm">We'll show you personalized picks once you've rated a few movies.</p>
      ) : (
        <CarouselSection items={recommendations} sectionId="hybrid" />
      )}
    </div>
  );
}
