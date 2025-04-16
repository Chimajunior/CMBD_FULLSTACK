import { Link } from "@remix-run/react";

export const meta = () => [
  { title: "How 'Based on Your History' Works - CMBD" },
];

export default function ContentBasedInfoPage() {
  return (
    <div className="min-h-screen bg-[#121212] text-white px-6 py-20 md:px-16 max-w-3xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-bold text-yellow-400 mb-8">
        How "Based on Your History" Works
      </h1>

      <p className="text-gray-300 mb-6 text-lg leading-relaxed">
        This section uses <span className="text-yellow-300 font-semibold">Content-Based Filtering</span>.
        We analyze the genres, themes, and attributes of movies you’ve rated highly, and recommend similar ones you haven't seen yet.
      </p>

      <div className="bg-[#1e1e1e] p-6 border-l-4 border-yellow-500 rounded mb-10 text-md text-gray-400">
        🎬 If you love <em>Mind-bending Sci-Fi</em> like <em>Inception</em> or <em>Interstellar</em>, we'll suggest more movies that match those characteristics — based on your history.
      </div>

      <p className="text-gray-400 mb-12 text-md leading-relaxed">
        The more movies you rate, the smarter these recommendations get.
        It’s all about matching your personal viewing history to future favorites.
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
