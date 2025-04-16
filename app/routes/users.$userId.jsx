import { useLoaderData, redirect } from "@remix-run/react";
import { json } from "@remix-run/node";
import Navbar from "../components/nav";
import Footer from "../components/footer";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileStats from "../components/profile/ProfileStats";
import RatingChart from "../components/profile/RatingCharts";
import GenreTags from "../components/profile/GenreTags";
import ReviewCard from "../components/profile/PublicReviewCard";
import MovieCard from "../components/MovieCard";
import HorizontalScrollWrapper from "../components/ui/HorizontalScrollWrapper";




export const loader = async ({ params, request }) => {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(/token=([^;]+)/);
  const token = match ? match[1] : null;

  let loggedInUserId = null;
  if (token) {
    try {
      const payload = JSON.parse(
        Buffer.from(token.split(".")[1], "base64").toString()
      );
      loggedInUserId = payload.id;
    } catch {
    }
  }

  if (String(loggedInUserId) === params.userId) {
    return redirect("/profile");
  }

  // const API_BASE =
  // typeof window !== "undefined"
  //   ? window.ENV?.VITE_API_URL
  //   : process.env.VITE_API_URL || "http://localhost:5000";

  const res = await fetch(`/api/users/${params.userId}`);
  if (!res.ok) {
    throw new Response("User not found", { status: 404 });
  }

  const profile = await res.json();
  return json(profile);
};


export default function PublicUserProfile() {
  const profile = useLoaderData();

  return (
    <div className="bg-[#121212] text-white min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto pt-28 px-6 pb-24">
        {/* Header */}
        <ProfileHeader
          avatar={profile?.avatar}
          username={profile?.username}
          joinedAt={profile?.joined}
        />

        {/* Stats */}
        <ProfileStats
          stats={{
            reviews: profile?.reviews?.length || 0,
            ratingsOnly: profile?.rating_only?.length || 0,
            watchlist: profile?.watchlist?.length || 0, 
            avgRating: profile?.average_rating || 0,
          }}
        />

        <div className="grid lg:grid-cols-2 gap-8 mb-10">
          <RatingChart reviews={profile?.reviews || []} />
          <GenreTags reviews={profile?.reviews || []} />
        </div>

        {/* Reviews Tab */}
        <div className="mb-12">
        <HorizontalScrollWrapper title="Reviews">
  {profile.reviews.map((rev) => (
    <div key={rev.id} className="snap-start flex-shrink-0 w-[300px] sm:w-[340px]">
      <ReviewCard review={rev} isPublic />
    </div>
  ))}
</HorizontalScrollWrapper>
</div>


        {/* Ratings Only Tab */}
        <div className="mb-12">
        <HorizontalScrollWrapper title="Ratings">
  {profile.rating_only.map((movie) => (
    <div key={movie.id} className="snap-start flex-shrink-0 w-[180px] sm:w-[200px]">
      <MovieCard {...movie} />
    </div>
  ))}
</HorizontalScrollWrapper>

</div>

      </main>

      <Footer />
    </div>
  );
}
