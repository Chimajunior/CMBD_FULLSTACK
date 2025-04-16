import { useEffect, useState } from "react";
import CarouselSection from "../CarouselSection";
import { Info } from "lucide-react";

export default function ContentBasedRecs() {
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
  
    const fetchContentBased = async () => {
      try {
        
          
        const res = await fetch(`/api/recommendations/content-based`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        const data = await res.json();
        setRecs(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("Failed to load content-based recommendations.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchContentBased();
  }, []);
  

  if (!localStorage.getItem("token")) return null;

  return (
    <div className="w-full px-6 md:px-10 py-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl text-white font-bold">Based on your History</h2>
        <a href="/about/content-based" title="How content-based recommendations work">
          <Info className="w-5 h-5 text-yellow-400 hover:text-yellow-300" />
        </a>
      </div>
      {loading ? (
        <p className="text-gray-400 italic text-sm">Loading recommendations based on your ratings...</p>
      ) : error ? (
        <p className="text-red-400 italic text-sm">{error}</p>
      ) : recs.length === 0 ? (
        <p className="text-gray-400 italic text-sm">We’ll recommend similar movies once you’ve rated a few.</p>
      ) : (
        <CarouselSection items={recs} sectionId="content-based" />
      )}
    </div>
  );
}
