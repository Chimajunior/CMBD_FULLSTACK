import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-[#2a2a2a] text-white text-sm px-3 py-2 rounded shadow">
        <p className="font-semibold text-yellow-400">{label}</p>
        <p>{payload[0].value} rating{payload[0].value !== 1 ? "s" : ""}</p>
      </div>
    );
  }
  return null;
};

export default function RatingChart({ reviews = [] }) {
  const chartData = [1, 2, 3, 4, 5].map((rating) => ({
    rating: `${rating}★`,
    count: reviews.filter((r) => r.rating === rating).length,
  }));

  return (
    <div className="bg-[#1f1f1f] p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Rating Distribution</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="rating" stroke="#ccc" />
            <YAxis stroke="#ccc" allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" fill="#facc15" radius={[4, 4, 0, 0]} animationDuration={800}>
              <LabelList dataKey="count" position="top" fill="#facc15" fontSize={12} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
