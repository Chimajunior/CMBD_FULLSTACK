import { Link } from "@remix-run/react";

export const meta = () => [
  { title: "How 'Similar Users Liked' Works - CMBD" },
];

export default function CollaborativeInfoPage() {
  return (
    <div className="min-h-screen bg-[#121212] text-white px-6 py-20 md:px-16 max-w-3xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-bold text-yellow-400 mb-8">
        How "Similar Users Liked" Works
      </h1>

      <p className="text-gray-300 mb-6 text-lg leading-relaxed">
        This recommendation section is powered by{" "}
        <span className="text-yellow-300 font-semibold">Collaborative Filtering</span>.
        It analyzes users with similar taste to yours — based on what you've rated highly — and suggests what those users enjoyed that you haven’t watched yet.
      </p>

      <div className="bg-[#1e1e1e] p-6 border-l-4 border-yellow-500 rounded mb-10 text-md text-gray-400">
        If you loved <em>Inception</em> and so did another user — and they also rated <em>Tenet</em> highly — we’ll recommend <em>Tenet</em> to you next.
      </div>

      <Link
        to="/"
        className="inline-block bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 py-3 rounded-full transition"
      >
        ← Back to Home
      </Link>
    </div>
  );
}










