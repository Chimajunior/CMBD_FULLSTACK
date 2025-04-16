import { Link, useNavigate } from "@remix-run/react";

export default function MobileMenu({ open, onClose, user, onLogout }) {
  const navigate = useNavigate();

  if (!open) return null;

  const handleWatchlistRedirect = () => {
    onClose();
    if (user) {
      navigate("/watchlist");
    } else {
      navigate("/login?redirectTo=/watchlist");
    }
  };

  return (
    <div className="fixed inset-0 top-[132px] bg-[#121212] z-40 flex flex-col items-center justify-start pt-10 gap-6 text-lg">
      <Link to="/" onClick={onClose}>Home</Link>
      <Link to="/moviesPage" onClick={onClose}>Movies</Link>
      
      {/* Watchlist logic */}
      <button onClick={handleWatchlistRedirect}>
        Watchlist
      </button>

      {!user ? (
        <Link to="/login" onClick={onClose}>Login</Link>
      ) : (
        <>
          <Link to="/profile" onClick={onClose}>Profile</Link>
          <button onClick={() => { onClose(); onLogout(); }} className="text-red-400">
            Logout
          </button>
        </>
      )}
    </div>
  );
}
