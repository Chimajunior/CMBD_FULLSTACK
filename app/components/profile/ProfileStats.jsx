import React from "react";

function StatBox({ label, value, isMessage = false }) {
  return (
    <div className="bg-[#1a1a1a] p-4 rounded-lg shadow text-center flex items-center justify-center flex-col h-24">
      {isMessage ? (
        <p className="text-yellow-400 text-lg font-bold text-center leading-tight">
          {value}
        </p>
      ) : (
        <>
          <p className="text-yellow-400 text-3xl font-bold">{value ?? 0}</p>
          <p className="text-sm text-gray-400 mt-1">{label}</p>
        </>
      )}
    </div>
  );
}


export default function ProfileStats({ stats }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-10">
      <StatBox label="Reviews" value={stats?.reviews} />
      <StatBox label="Ratings only" value={stats?.ratingsOnly} />
      <StatBox label="Watchlist" value={stats?.watchlist} />
      <StatBox value="More coming soon" isMessage />
    </div>
  );
}