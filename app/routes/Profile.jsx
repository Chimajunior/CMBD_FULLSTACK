import { useEffect, useState } from "react";
import Navbar from "../components/nav";
import Footer from "../components/footer";
import ToastBanner from "../components/profile/ToastBanner";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileStats from "../components/profile/ProfileStats";
import RatingChart from "../components/profile/RatingCharts";
import GenreTags from "../components/profile/GenreTags";
import ReviewCard from "../components/profile/ReviewCard";
import WatchlistGrid from "../components/profile/WatchlistGrid";
import SettingsForm from "../components/profile/SettingsForm";
import TabNavigation from "../components/profile/TabNavigation";
import RatingsOnlyGrid from "../components/profile/RatingsOnlyGrid";
import CarouselSection from "../components/CarouselSection";
import ActivityComingSoon from "../components/profile/activity";

export default function ProfilePage() {
  const [token, setToken] = useState(null);
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [toast, setToast] = useState({ message: "", type: "" });
  const [recommended, setRecommended] = useState([]);
  const [loadingRec, setLoadingRec] = useState(true);

  // Get token
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // Fetch data once token is available
  useEffect(() => {
    if (!token) return;
    fetchProfile();
    fetchRecommendations();
  }, [token]);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`/api/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (!res.ok) {
        const errText = await res.text();
        console.error("Profile fetch failed:", res.status, errText);
  
        if (res.status === 401) {
          setToast({ message: "Session expired. Please log in again.", type: "error" });
          localStorage.removeItem("token");
          setTimeout(() => window.location.href = "/login", 2000);
          return;
        }
  
        throw new Error("Failed to load profile: " + res.status);
      }
  
      const data = await res.json();
      setProfile(data);
    } catch (err) {
      console.error("Error loading profile:", err.message);
      setToast({ message: "Could not load profile", type: "error" });
    }
  };
  

  const fetchRecommendations = async () => {
    try {
      setLoadingRec(true);
      const res = await fetch(`/api/recommendations/hybrid`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setRecommended(Array.isArray(data) ? data : []);
    } catch {
      console.error("Failed to fetch recommendations");
    } finally {
      setLoadingRec(false);
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 3000);
  };

  const deleteReview = async (id) => {
    await fetch(`/api/reviews/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchProfile();
    showToast("Review deleted");
  };

  const updateReview = async (rev) => {
    const res = await fetch(`/api/reviews/${rev.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ review: rev.review, rating: rev.rating }),
    });

    if (res.ok) {
      fetchProfile();
      showToast("Review updated");
    }
  };

  if (!profile) {
    return (
      <div className="bg-[#121212] text-white min-h-screen">
        <Navbar />
        <main className="max-w-7xl mx-auto pt-28 px-6 pb-24">
          <p className="text-gray-400 text-center">Loading profile...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-[#121212] text-white min-h-screen">
      <Navbar />
      <ToastBanner message={toast.message} type={toast.type} />
      <main className="max-w-7xl mx-auto pt-28 px-6 pb-24">
        <ProfileHeader
          avatar={profile?.avatar}
          username={profile?.username}
          joinedAt={profile?.joined}
        />

        <div className="overflow-x-auto hide-scrollbar mb-6 -mx-2 px-2">
          <TabNavigation
            tabs={[
              "dashboard",
              "reviews",
              "ratings",
              "watchlist",
              "settings",
              "activity",
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </div>

        {activeTab === "dashboard" && (
          <>
            <ProfileStats
              stats={{
                reviews: profile?.reviews?.length || 0,
                ratingsOnly: profile?.rating_only?.length || 0,
                watchlist: profile?.watchlist?.length || 0,
                avgRating: profile?.average_rating || 0,
              }}
            />

            <div className="grid lg:grid-cols-2 gap-8 mb-10">
              <RatingChart
                reviews={[
                  ...(profile?.reviews || []),
                  ...(profile?.rating_only || []),
                ]}
              />
              <GenreTags reviews={profile?.reviews || []} />
            </div>

            {loadingRec ? (
              <p className="text-gray-400 mt-12">Loading recommendations...</p>
            ) : recommended.length > 0 ? (
              <div className="w-full mt-12 space-y-4">
                <h2 className="text-2xl font-bold">Recommended For You</h2>
                <CarouselSection items={recommended} sectionId="profile-recs" />
              </div>
            ) : (
              <p className="text-gray-400 mt-12 italic">
                No recommendations found. Try rating more movies!
              </p>
            )}
          </>
        )}

        {activeTab === "reviews" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">Your Reviews</h2>
            {Array.isArray(profile?.reviews) && profile.reviews.length > 0 ? (
              profile.reviews.map((rev) => (
                <ReviewCard
                  key={rev.id}
                  review={rev}
                  onDelete={deleteReview}
                  onSave={updateReview}
                />
              ))
            ) : (
              <p className="text-gray-400 italic">
                You haven’t written any reviews yet.
              </p>
            )}
          </div>
        )}

        {activeTab === "ratings" && (
          <RatingsOnlyGrid movies={profile?.rating_only || []} />
        )}

        {activeTab === "watchlist" && (
          <WatchlistGrid movies={profile?.watchlist || []} />
        )}

        {activeTab === "settings" && (
          <SettingsForm
            token={token}
            initialUsername={profile?.username}
            initialEmail={profile?.email}
            initialAvatar={profile?.avatar}
            onSave={fetchProfile}
            showToast={showToast}
          />
        )}

        {activeTab === "activity" && <ActivityComingSoon />}
      </main>
      <Footer />
    </div>
  );
}


// import { useEffect, useState } from "react";
// import Navbar from "../components/nav";
// import Footer from "../components/footer";
// import ToastBanner from "../components/profile/ToastBanner";
// import ProfileHeader from "../components/profile/ProfileHeader";
// import ProfileStats from "../components/profile/ProfileStats";
// import RatingChart from "../components/profile/RatingCharts";
// import GenreTags from "../components/profile/GenreTags";
// import ReviewCard from "../components/profile/ReviewCard";
// import WatchlistGrid from "../components/profile/WatchlistGrid";
// import SettingsForm from "../components/profile/SettingsForm";
// import TabNavigation from "../components/profile/TabNavigation";
// import RatingsOnlyGrid from "../components/profile/RatingsOnlyGrid";
// import CarouselSection from "../components/CarouselSection";
// import ActivityComingSoon from "../components/profile/activity";

// // const API_BASE =
// //   typeof window !== "undefined"
// //     ? window.ENV?.VITE_API_URL
// //     : process.env.VITE_API_URL || "http://localhost:5000";

// export default function ProfilePage() {
//   const [token, setToken] = useState(null);
//   const [profile, setProfile] = useState(null);
//   const [activeTab, setActiveTab] = useState("dashboard");
//   const [toast, setToast] = useState({ message: "", type: "" });
//   const [recommended, setRecommended] = useState([]);
//   const [loadingRec, setLoadingRec] = useState(true);

//   useEffect(() => {
//     const storedToken = localStorage.getItem("token");
//     if (storedToken) setToken(storedToken);
//   }, []);

//   useEffect(() => {
//     if (token) {
//       fetchProfile();
//       fetchRecommendations();
//     }
//   }, [token]);

//   // fetch profile
//   const fetchProfile = async () => {
//     const res = await fetch(`/api/profile`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     const data = await res.json();
//     setProfile(data);
//   };

//   // fetch reccomendations
//   const fetchRecommendations = async () => {
//     try {
//       setLoadingRec(true);
//       const res = await fetch(`/api/recommendations/hybrid`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       setRecommended(Array.isArray(data) ? data : []);
//     } catch {
//       console.error("Failed to fetch recommendations");
//     } finally {
//       setLoadingRec(false);
//     }
//   };

//   const showToast = (message, type = "success") => {
//     setToast({ message, type });
//     setTimeout(() => setToast({ message: "", type: "" }), 3000);
//   };

//   // delete review
//   const deleteReview = async (id) => {
//     await fetch(`/api/reviews/${id}`, {
//       method: "DELETE",
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     fetchProfile();
//     showToast("Review deleted");
//   };

//   // update review
//   const updateReview = async (rev) => {
//     const res = await fetch(`/api/reviews/${rev.id}`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({ review: rev.review, rating: rev.rating }),
//     });

//     if (res.ok) {
//       fetchProfile();
//       showToast("Review updated");
//     }
//   };

//   if (!profile) {
//     return (
//       <div className="bg-[#121212] text-white min-h-screen">
//         <Navbar />
//         <main className="max-w-7xl mx-auto pt-28 px-6 pb-24">
//           <p className="text-gray-400 text-center">Loading profile...</p>
//         </main>
//         <Footer />
//       </div>
//     );
//   }

//   return (
//     <div className="bg-[#121212] text-white min-h-screen">
//       <Navbar />
//       <ToastBanner message={toast.message} type={toast.type} />

//       <main className="max-w-7xl mx-auto pt-28 px-6 pb-24">
//         {/* Header */}
//         <ProfileHeader
//           avatar={profile?.avatar}
//           username={profile?.username}
//           joinedAt={profile?.joined}
//         />

//         {/* Tabs */}
//         <div className="overflow-x-auto hide-scrollbar mb-6 -mx-2 px-2">
//           <TabNavigation
//             tabs={[
//               "dashboard",
//               "reviews",
//               "ratings",
//               "watchlist",
//               "settings",
//               "activity",
//             ]}
//             activeTab={activeTab}
//             onChange={setActiveTab}
//           />
//         </div>

//         {/* Dashboard Tab */}
//         {activeTab === "dashboard" && (
//           <>
//             <ProfileStats
//               stats={{
//                 reviews: profile?.reviews?.length,
//                 ratingsOnly: profile?.rating_only?.length,
//                 watchlist: profile?.watchlist?.length,
//                 avgRating: profile?.avg_rating,
//               }}
//             />

//             <div className="grid lg:grid-cols-2 gap-8 mb-10">
//               <RatingChart
//                 reviews={[
//                   ...(profile?.reviews || []),
//                   ...(profile?.rating_only || []),
//                 ]}
//               />
//               <GenreTags reviews={profile?.reviews || []} />
//             </div>

//             {/* Recommended Movies */}
//             {loadingRec ? (
//               <p className="text-gray-400 mt-12">Loading recommendations...</p>
//             ) : recommended.length > 0 ? (
//               <div className="w-full mt-12 space-y-4">
//                 <h2 className="text-2xl font-bold">Recommended For You</h2>
//                 <CarouselSection items={recommended} sectionId="profile-recs" />
//               </div>
//             ) : (
//               <p className="text-gray-400 mt-12 italic">
//                 No recommendations found. Try rating more movies!
//               </p>
//             )}
//           </>
//         )}

//         {/* Reviews Tab */}
//         {activeTab === "reviews" && (
//           <div className="space-y-6">
//             <h2 className="text-2xl font-bold mb-4">Your Reviews</h2>
//             {profile?.reviews?.length > 0 ? (
//               profile.reviews.map((rev) => (
//                 <ReviewCard
//                   key={rev.id}
//                   review={rev}
//                   onDelete={deleteReview}
//                   onSave={updateReview}
//                 />
//               ))
//             ) : (
//               <p className="text-gray-400 italic">
//                 You haven’t written any reviews yet.
//               </p>
//             )}
//           </div>
//         )}

//         {/* Ratings tab */}
//         {activeTab === "ratings" && (
//           <RatingsOnlyGrid movies={profile?.rating_only || []} />
//         )}

//         {/* Watchlist Tab */}
//         {activeTab === "watchlist" && (
//           <WatchlistGrid movies={profile?.watchlist || []} />
//         )}

//         {/* Settings Tab */}
//         {activeTab === "settings" && (
//           <SettingsForm
//             token={token}
//             initialUsername={profile?.username}
//             initialEmail={profile?.email}
//             initialAvatar={profile?.avatar}
//             onSave={fetchProfile}
//             showToast={showToast}
//           />
//         )}

//         {/* Settings Tab */}
//         {activeTab === "activity" && <ActivityComingSoon />}
//       </main>
//       <Footer />
//     </div>
//   );
// }
