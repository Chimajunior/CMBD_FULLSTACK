import React from "react";
import { Clock } from "lucide-react";

export default function ActivityComingSoon() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center py-20 px-4 bg-[#121212] text-white text-center">
      <div className="flex flex-col items-center gap-6 max-w-lg">
        <Clock className="w-16 h-16 text-yellow-500 animate-pulse" />
        <h1 className="text-3xl sm:text-4xl font-bold">Activity Feed Coming Soon</h1>
        <p className="text-gray-400 text-base sm:text-lg">
          You’ll soon be able to see your recent ratings, reviews, helpful votes, and more!
        </p>
        <p className="text-sm text-gray-500 italic">
          We’re cooking something exciting behind the scenes 
        </p>
      </div>
    </div>
  );
}
