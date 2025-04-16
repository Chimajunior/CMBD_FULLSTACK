import { Link, useNavigate, useLocation } from "@remix-run/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ShieldCheck, LogOut, ArrowLeft, FileText } from "lucide-react";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.role !== "admin") {
        toast.error("Access denied");
        navigate("/");
      } else {
        setIsAdmin(true);
      }
    } catch {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!isAdmin) return null;

  const isActive = (path) => location.pathname === path;

  return (
    <header className="w-full bg-[#121212] text-white shadow-md top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between h-[64px]">
        {/* Left: Title + Breadcrumb */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-yellow-400" />
            <h1 className="text-xl font-bold text-yellow-400">Admin Panel</h1>
          </div>
          <Link
            to="/"
            className="text-sm text-gray-400 hover:text-yellow-300 flex items-center gap-1 ml-6"
            title="Return to public site"
          >
            <ArrowLeft size={16} /> Back to CMBD
          </Link>
        </div>

        {/* Right: Navigation */}
        <nav className="flex gap-6 items-center">
          <Link
            to="/dashboard"
            className={`hover:text-yellow-400 ${
              isActive("/dashboard") ? "text-yellow-400 font-semibold" : ""
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/dashboardlogs"
            className={`hover:text-yellow-400 flex items-center gap-1 ${
              isActive("/dashboardlogs") ? "text-yellow-400 font-semibold" : ""
            }`}
          >
            <FileText size={16} />
            Logs
          </Link>
          <button
            onClick={handleLogout}
            className="text-red-400 hover:text-red-300 flex items-center gap-1"
          >
            <LogOut size={16} />
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
};

export default AdminNavbar;
