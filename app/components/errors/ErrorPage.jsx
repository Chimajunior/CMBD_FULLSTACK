import { Link } from "@remix-run/react";
import { AlertTriangle } from "lucide-react";

export default function ErrorPage({ code = 500, title = "Error", message }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#121212] text-white px-6">
      <div className="text-center">
        <AlertTriangle className="w-14 h-14 text-yellow-400 mb-4 mx-auto" />
        <h1 className="text-5xl font-bold mb-2">
          {code} – {title}
        </h1>
        <p className="text-gray-400 mb-6">{message}</p>
        <Link
          to="/"
          className="bg-yellow-500 text-black px-6 py-3 font-semibold rounded hover:bg-yellow-400 transition"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}
