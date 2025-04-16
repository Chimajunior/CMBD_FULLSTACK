
  import { Link, useLocation, useNavigate } from "@remix-run/react";
  import { useEffect, useRef, useState } from "react";
  import { Menu, X, PlusCircle, Search, Loader2, X as Close } from "lucide-react";
  import SearchBar from "./nav/SearchBar";
  import UserDropdown from "./nav/UserDropdown";
  import MobileMenu from "./nav/MobileMenu";
  import useSearchSuggestions from "../hooks/useSearchSuggestions";
  

  
  const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dropdownRef = useRef(null);
  
    const [user, setUser] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
    const {
      query,
      setQuery,
      results,
      setResults,
      loading,
      highlighted,
      setHighlighted,
      handleSearch,
      handleKeyDown,
    } = useSearchSuggestions();
  
    const highlightMatch = (text) => {
      const regex = new RegExp(`(${query})`, "gi");
      return text.replace(
        regex,
        `<mark class="bg-yellow-300 text-black">$1</mark>`
      );
    };
  
    const isActive = (path) => location.pathname === path;
  
    useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token) return;
  
      fetch(`/api/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then(setUser)
        .catch(() => setUser(null));
    }, []);
  
    useEffect(() => {
      const handleClickOutside = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
          setDropdownOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
  
    const handleLogout = () => {
      localStorage.removeItem("token");
      navigate("/login");
    };
  
    const handleWatchlistRedirect = () => {
      if (user) {
        navigate("/watchlist");
      } else {
        navigate("/login?redirectTo=/watchlist");
      }
    };
  
    return (
      <header className="w-full bg-[#121212] text-white shadow-md top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[80px] flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold">
            CMBD
          </Link>
  
          {/* SearchBar - Desktop Only */}
          <div className="hidden md:block w-full max-w-md">
            <SearchBar
              query={query}
              setQuery={setQuery}
              results={results}
              setResults={setResults}
              loading={loading}
              highlighted={highlighted}
              setHighlighted={setHighlighted}
              handleSearch={handleSearch}
              handleKeyDown={handleKeyDown}
              highlightMatch={highlightMatch}
            />
          </div>
  
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`hover:text-yellow-400 transition ${
                isActive("/") ? "text-yellow-400 font-semibold" : ""
              }`}
            >
              Home
            </Link>
            <Link
              to="/moviesPage"
              className={`hover:text-yellow-400 transition ${
                isActive("/moviesPage") ? "text-yellow-400 font-semibold" : ""
              }`}
            >
              Movies
            </Link>
            <button
              onClick={handleWatchlistRedirect}
              className="hover:text-yellow-400 transition flex items-center gap-1"
            >
              <PlusCircle size={16} className="text-yellow-400 mr-1" />
              Watchlist
            </button>
  
            {!user ? (
              <Link
                to="/login"
                className="bg-white text-black px-4 py-2 rounded-xl hover:bg-black hover:text-white transition"
              >
                Login
              </Link>
            ) : (
              <UserDropdown
                user={user}
                onLogout={handleLogout}
                dropdownOpen={dropdownOpen}
                toggle={() => setDropdownOpen((prev) => !prev)}
                dropdownRef={dropdownRef}
              />
            )}
          </div>
  
          {/* Hamburger */}
          <button
            className="md:hidden focus:outline-none"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
  
        {/* Mobile Search */}
        <div className="md:hidden px-4 pb-3 relative w-full">
          <form method="get" className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-700 pointer-events-none" />
            <input
              type="search"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search movies..."
              className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-[#FFE38C] text-black placeholder-yellow-700 font-medium outline-none focus:ring-2 focus:ring-yellow-400"
            />
            {loading && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-yellow-700" />
            )}
            {query && !loading && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-yellow-800"
              >
                <Close size={18} />
              </button>
            )}
          </form>
        </div>
  
        {/* Mobile Menu */}
        <MobileMenu
          open={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          user={user}
          onLogout={handleLogout}
        />
      </header>
    );
  };
  
  export default Navbar;
  


// import { Link, useLocation, useNavigate } from "@remix-run/react";
// import { useEffect, useRef, useState } from "react";
// import { Menu, X, PlusCircle } from "lucide-react";
// import SearchBar from "./nav/SearchBar";
// import UserDropdown from "./nav/UserDropdown";
// import MobileMenu from "./nav/MobileMenu";
// import useSearchSuggestions from "../hooks/useSearchSuggestions";

// // const API_BASE =
// //   typeof window !== "undefined"
// //     ? window.ENV?.VITE_API_URL
// //     : process.env.VITE_API_URL || "http://localhost:5000";

// const Navbar = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const dropdownRef = useRef(null);

//   const [user, setUser] = useState(null);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   const {
//     query,
//     setQuery,
//     results,
//     setResults,
//     loading,
//     highlighted,
//     setHighlighted,
//     handleSearch,
//     handleKeyDown,
//   } = useSearchSuggestions();

//   const highlightMatch = (text) => {
//     const regex = new RegExp(`(${query})`, "gi");
//     return text.replace(
//       regex,
//       `<mark class="bg-yellow-300 text-black">$1</mark>`
//     );
//   };

//   const isActive = (path) => location.pathname === path;

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) return;

//     fetch(`/api/profile`, {
//       headers: { Authorization: `Bearer ${token}` },
//     })
//       .then((res) => res.json())
//       .then(setUser)
//       .catch(() => setUser(null));
//   }, []);

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/login");
//   };

//   const handleWatchlistRedirect = () => {
//     if (user) {
//       navigate("/watchlist");
//     } else {
//       navigate("/login?redirectTo=/watchlist");
//     }
//   };

//   return (
//     <header className="w-full bg-[#121212] text-white shadow-md top-0 z-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[80px] flex items-center justify-between">
//         {/* Logo */}
//         <Link to="/" className="text-2xl font-bold">
//           CMBD
//         </Link>

//         {/* Search */}
//         <SearchBar
//           query={query}
//           setQuery={setQuery}
//           results={results}
//           setResults={setResults}
//           loading={loading}
//           highlighted={highlighted}
//           setHighlighted={setHighlighted}
//           handleSearch={handleSearch}
//           handleKeyDown={handleKeyDown}
//           highlightMatch={highlightMatch}
//         />

//         {/* Desktop Nav */}
//         <div className="hidden md:flex items-center gap-6">
//           <Link
//             to="/"
//             className={`hover:text-yellow-400 transition ${
//               isActive("/") ? "text-yellow-400 font-semibold" : ""
//             }`}
//           >
//             Home
//           </Link>
//           <Link
//             to="/moviesPage"
//             className={`hover:text-yellow-400 transition ${
//               isActive("/moviesPage") ? "text-yellow-400 font-semibold" : ""
//             }`}
//           >
//             Movies
//           </Link>
//           <button
//             onClick={handleWatchlistRedirect}
//             className="hover:text-yellow-400 transition flex items-center gap-1"
//           >
//             <PlusCircle size={16} className="text-yellow-400 mr-1" />
//             Watchlist
//           </button>

//           {!user ? (
//             <Link
//               to="/login"
//               className="bg-white text-black px-4 py-2 rounded-xl hover:bg-black hover:text-white transition"
//             >
//               Login
//             </Link>
//           ) : (
//             <UserDropdown
//               user={user}
//               onLogout={handleLogout}
//               dropdownOpen={dropdownOpen}
//               toggle={() => setDropdownOpen((prev) => !prev)}
//               dropdownRef={dropdownRef}
//             />
//           )}
//         </div>

//         {/* Hamburger */}
//         <button
//           className="md:hidden focus:outline-none"
//           onClick={() => setMobileMenuOpen((prev) => !prev)}
//         >
//           {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
//         </button>
//       </div>

//       {/* Mobile Search */}
//       <div className="px-4 pb-3 md:hidden">
//         <form method="get" className="relative w-full">
//           <input
//             type="search"
//             value={query}
//             onChange={(e) => handleSearch(e.target.value)}
//             onKeyDown={handleKeyDown}
//             placeholder="Search movies..."
//             className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#FFE38C] text-black placeholder-yellow-700 font-medium outline-none focus:ring-2 focus:ring-yellow-400"
//           />
//         </form>
//       </div>

//       {/* Mobile Menu */}
//       <MobileMenu
//         open={mobileMenuOpen}
//         onClose={() => setMobileMenuOpen(false)}
//         user={user}
//         onLogout={handleLogout}
//       />
//     </header>
//   );
// };

// export default Navbar;
