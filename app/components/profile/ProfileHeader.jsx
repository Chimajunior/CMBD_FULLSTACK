import React from "react";

export default function ProfileHeader({ avatar, username, joinedAt }) {
  return (
    <div className="flex items-center gap-6 mb-8">
      <img
        src={avatar || "https://randomuser.me/api/portraits/lego/1.jpg"}
        alt="User avatar"
        className="w-20 h-20 rounded-full border-4 border-yellow-500 object-cover"
      />
      <div>
        <h1 className="text-3xl font-bold">{username || "..."}</h1>
        <p className="text-gray-400 text-sm">
          Joined{" "}
          {joinedAt
            ? new Date(joinedAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "—"}
        </p>
      </div>
    </div>
  );
}
