import { useEffect, useState } from "react";
import AdminNavbar from "../components/dashboard/admin-navbar";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function ModerationLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
  
    const API_BASE =
    typeof window !== "undefined"
      ? window.ENV?.VITE_API_URL
      : process.env.VITE_API_URL || "http://localhost:5000";
    
    fetch(`${API_BASE}/api/reviews/moderation-logs`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setLogs(data);
        } else {
          toast.error("Invalid response format.");
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        toast.error("Failed to fetch moderation logs.");
      })
      .finally(() => setLoading(false));
  }, []);
  

  return (
    <div className="bg-[#121212] min-h-screen text-white">
      <AdminNavbar />
      <div className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-yellow-400 mb-8">
          Moderation Logs
        </h1>

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="animate-spin h-6 w-6 text-yellow-400" />
          </div>
        ) : logs.length === 0 ? (
          <p className="text-gray-400 italic">
            No moderation actions logged yet.
          </p>
        ) : (
          <div className="space-y-4">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-4 bg-[#1e1e1e] rounded border border-gray-700"
              >
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span className="text-yellow-300 font-semibold">
                    {log.admin}
                  </span>
                  <span>{new Date(log.timestamp).toLocaleString()}</span>
                </div>
                <p className="text-gray-300 text-sm mb-1">
                  <strong className="uppercase text-yellow-400 mr-1">
                    {log.action}
                  </strong>
                  review from{" "}
                  <span className="italic text-white">{log.movie_title}</span>
                </p>
                <p className="text-xs text-gray-500 italic">"{log.review}"</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
