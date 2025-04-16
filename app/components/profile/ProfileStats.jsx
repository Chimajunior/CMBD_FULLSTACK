import React from "react";

function StatBox({ label, value }) {
  return (
    <div className="bg-[#1a1a1a] p-4 rounded-lg shadow text-center">
      <p className="text-yellow-400 text-3xl font-bold">{value ?? 0}</p>
      <p className="text-sm text-gray-400 mt-1">{label}</p>
    </div>
  );
}

export default function ProfileStats({ stats }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
      <StatBox label="Reviews" value={stats?.reviews} />
      <StatBox label="Ratings only" value={stats?.ratingsOnly} />
      <StatBox label="Watchlist" value={stats?.watchlist} />
      <StatBox value={"More coming soon"}
      />
    </div>
  );
}
