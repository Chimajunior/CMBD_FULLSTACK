import { Trash2 } from "lucide-react";

export default function UsersTab({ users = [], onDelete }) {
  const filteredUsers = users.filter(user => user.role !== "admin");

  if (filteredUsers.length === 0) {
    return <p className="text-gray-400 italic">No users found.</p>;
  }

  return (
    <div className="space-y-4">
      {filteredUsers.map((user) => (
        <div
          key={user.id}
          className="p-4 bg-[#1e1e1e] rounded flex justify-between items-center border border-gray-700"
        >
          <div>
            <p className="font-semibold text-white">{user.username}</p>
            <p className="text-sm text-gray-400">{user.email}</p>
            {user.reviewCount !== undefined && (
              <p className="text-xs text-gray-500 mt-1">
                {user.reviewCount} review{user.reviewCount === 1 ? "" : "s"}
              </p>
            )}
          </div>
          <button
            onClick={() => onDelete(user.id)}
            className="text-red-500 hover:text-red-400 text-sm flex items-center gap-1"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
