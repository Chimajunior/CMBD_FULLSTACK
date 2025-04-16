import { Link } from "@remix-run/react";
import { ChevronDown } from "lucide-react";

export default function UserDropdown({
  user,
  onLogout,
  dropdownOpen,
  toggle,
  dropdownRef,
}) {
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggle}
        className="flex items-center gap-2 hover:text-yellow-400"
      >
        <img
          src={user.avatar || "https://randomuser.me/api/portraits/lego/1.jpg"}
          alt="Avatar"
          className="w-9 h-9 rounded-full object-cover border-2 border-yellow-500 shadow"
        />
        <span className="text-sm font-medium">{user.username}</span>
        <ChevronDown size={16} />
      </button>

      {dropdownOpen && (
        <div className="absolute left-1/2 top-full -translate-x-1/2 mt-2 w-32 bg-[#1f1f1f] rounded-md shadow text-sm text-white z-50 border border-gray-700 text-center">
          <Link to="/profile" className="block px-3 py-2 hover:bg-[#2a2a2a]">
            Profile
          </Link>
          <button
            onClick={onLogout}
            className="w-full px-3 py-2 hover:bg-[#2a2a2a] text-red-400"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
