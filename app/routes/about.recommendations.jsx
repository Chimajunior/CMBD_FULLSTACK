import { Link } from "@remix-run/react";

export const meta = () => [
  { title: "How 'Recommended for You' Works - CMBD" },
];

export default function HybridInfoPage() {
  return (
    <div className="min-h-screen bg-[#121212] text-white px-6 py-20 md:px-16 max-w-3xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-bold text-yellow-400 mb-8">
        How "Recommended for You" Works
      </h1>

      <p className="text-gray-300 mb-6 text-lg leading-relaxed">
        The <span className="text-yellow-300 font-semibold">“Recommended for You”</span> section uses a{" "}
        <span className="font-semibold">hybrid recommendation system</span> that combines two approaches:
      </p>

      <ul className="list-disc list-inside text-gray-400 mb-8 space-y-3 text-md">
        <li>
          <strong>Content-Based Filtering:</strong> We recommend movies with similar genres or themes to those you've rated highly.
        </li>
        <li>
          <strong>Collaborative Filtering:</strong> We also consider what other users with similar tastes have enjoyed.
        </li>
      </ul>

      <div className="bg-[#1e1e1e] p-6 border-l-4 border-yellow-500 rounded mb-10 text-md text-gray-400">
        For example, if you rated <em>Inception</em> and <em>Interstellar</em> highly, and other users with similar taste also enjoyed <em>Arrival</em>, we might recommend <em>Arrival</em> to you — even if you haven’t seen it yet.
      </div>

      <p className="text-gray-400 mb-12 text-md leading-relaxed">
        This approach helps deliver more accurate and diverse movie suggestions — especially as you rate more movies!
      </p>

      <Link
        to="/"
        className="inline-block bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 py-3 rounded-full transition"
      >
        ← Back to Home
      </Link>
    </div>
  );
}
