import { Link } from "@remix-run/react";
import { Ghost } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#121212] text-white px-6">
      <div className="text-center">
        <Ghost className="w-16 h-16 text-yellow-400 mb-4 mx-auto" />

        <h1 className="text-4xl font-bold mb-2">404 - Page Not Found</h1>
        <p className="text-gray-400 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <Link
          to="/"
          className="inline-block bg-yellow-500 text-black font-semibold px-6 py-3 rounded hover:bg-yellow-400 transition"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}
