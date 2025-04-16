import { useEffect, useState } from "react";
import { Star, X } from "lucide-react";
import { useNavigate } from "@remix-run/react";

export default function RatingModal({
  isOpen,
  onClose,
  movie,
  onRate,
  initialRating = 0,
}) {
  const [selected, setSelected] = useState(initialRating);
  const [hovered, setHovered] = useState(null);
  const [toast, setToast] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setSelected(initialRating);
  }, [initialRating]);

  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };



  // const API_BASE =
  // typeof window !== "undefined"
  //   ? window.ENV?.VITE_API_URL
  //   : process.env.VITE_API_URL || "http://localhost:5000";
  
const handleSubmit = async () => {
  const token = localStorage.getItem("token");
  if (!token) return navigate(`/login?redirectTo=/movies/${movie.id}`);

  try {
    const res = await fetch(`/api/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        movie_id: movie.id,
        rating: selected,
        review: "", // just a rating
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Rating failed");

    onRate(selected); // Update parent state
    showToast("Thanks for rating!");
    setTimeout(() => onClose(), 1000);
  } catch (err) {
    showToast(err.message || "Something went wrong.");
  }
};

const handleRemove = async () => {
  const token = localStorage.getItem("token");
  if (!token) return navigate("/login");

  try {
    const res = await fetch(
      `/api/reviews/movie/${movie.id}/user`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!res.ok) throw new Error("Could not remove.");

    setSelected(0);
    onRate(0);
    showToast("Rating removed.");
    setTimeout(() => onClose(), 1000);
  } catch (err) {
    showToast(err.message || "Something went wrong.");
  }
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
      <div className="bg-[#1a1a1a] p-6 rounded-lg shadow-lg w-full max-w-md relative text-white">
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-white text-2xl"
        >
          &times;
        </button>

        <div className="text-center">
          <Star size={48} className="mx-auto text-yellow-400" />
          <p className="text-yellow-500 text-xs tracking-widest mt-2">RATE THIS</p>
          <h2 className="text-lg font-bold mt-1">{movie.title}</h2>

          <div className="flex justify-center mt-4 gap-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <Star
                key={num}
                size={32}
                onClick={() => {
                  if (selected !== num) setSelected(num); // Prevent re-clicking same star
                }}
                onMouseEnter={() => setHovered(num)}
                onMouseLeave={() => setHovered(null)}
                className={`cursor-pointer transition ${
                  hovered >= num || selected >= num
                    ? "fill-yellow-400 text-yellow-400 scale-110"
                    : "text-gray-500"
                }`}
              />
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-2">
            <button
              onClick={handleSubmit}
              disabled={selected === 0}
              className={`py-2 rounded font-semibold transition ${
                selected > 0
                  ? "bg-yellow-500 text-black hover:bg-yellow-400"
                  : "bg-gray-700 text-gray-400 cursor-not-allowed"
              }`}
            >
              {selected > 0 ? `Rate ${selected}/5` : "Rate"}
            </button>

            {initialRating > 0 && selected === initialRating && (
              <button
                onClick={handleRemove}
                className="text-sm text-red-400 hover:underline"
              >
                Remove rating
              </button>
            )}
          </div>
        </div>

        {toast && (
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-white text-black px-4 py-2 text-sm rounded shadow-md flex items-center gap-2">
            {toast}
            <button onClick={() => setToast("")}>
              <X size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}




// import { useEffect, useState } from "react";
// import { Star, X } from "lucide-react";
// import { useNavigate } from "@remix-run/react";

// export default function RatingModal({
//   isOpen,
//   onClose,
//   movie,
//   onRate,
//   initialRating = 0,
// }) {
//   const [selected, setSelected] = useState(initialRating);
//   const [hovered, setHovered] = useState(null);
//   const [toast, setToast] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     setSelected(initialRating);
//   }, [initialRating]);

//   useEffect(() => {
//     const handleEsc = (e) => e.key === "Escape" && onClose();
//     window.addEventListener("keydown", handleEsc);
//     return () => window.removeEventListener("keydown", handleEsc);
//   }, [onClose]);

//   const showToast = (msg) => {
//     setToast(msg);
//     setTimeout(() => setToast(""), 3000);
//   };

//   const handleSubmit = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) return navigate(`/login?redirectTo=/movies/${movie.id}`);

//     try {
//       const res = await fetch("http://localhost:5000/api/reviews", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           movie_id: movie.id,
//           rating: selected,
//           review: "",
//         }),
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Rating failed");

//       onRate(selected); // Update MovieCard / MovieDetail state
//       showToast("Thanks for rating!");
//       setTimeout(() => onClose(), 1000);
//     } catch (err) {
//       showToast(err.message || "Something went wrong.");
//     }
//   };

//   const handleRemove = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) return navigate("/login");

//     try {
//       const res = await fetch(
//         `http://localhost:5000/api/reviews/movie/${movie.id}/user`,
//         {
//           method: "DELETE",
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Could not remove.");

//       setSelected(0);
//       onRate(0);
//       showToast("Rating removed.");
//       setTimeout(() => onClose(), 1000);
//     } catch (err) {
//       showToast(err.message || " Something went wrong.");
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
//       <div className="bg-[#1a1a1a] p-6 rounded-lg shadow-lg w-full max-w-md relative text-white">
//         <button
//           onClick={onClose}
//           className="absolute top-2 right-4 text-white text-2xl"
//         >
//           &times;
//         </button>

//         <div className="text-center">
//           <Star size={48} className="mx-auto text-yellow-400" />
//           <p className="text-yellow-500 text-xs tracking-widest mt-2">
//             RATE THIS
//           </p>
//           <h2 className="text-lg font-bold mt-1">{movie.title}</h2>

//           <div className="flex justify-center mt-4 gap-2">
//             {[1, 2, 3, 4, 5].map((num) => (
//               <Star
//                 key={num}
//                 size={32}
//                 onClick={() => setSelected(num)}
//                 onMouseEnter={() => setHovered(num)}
//                 onMouseLeave={() => setHovered(null)}
//                 className={`cursor-pointer transition ${
//                   hovered >= num || selected >= num
//                     ? "fill-yellow-400 text-yellow-400 scale-110"
//                     : "text-gray-500"
//                 }`}
//               />
//             ))}
//           </div>

//           <div className="mt-6 flex flex-col gap-2">
//             <button
//               onClick={handleSubmit}
//               disabled={selected === 0}
//               className={`py-2 rounded font-semibold transition ${
//                 selected > 0
//                   ? "bg-yellow-500 text-black hover:bg-yellow-400"
//                   : "bg-gray-700 text-gray-400 cursor-not-allowed"
//               }`}
//             >
//               {selected > 0 ? `Rate ${selected}/5` : "Rate"}
//             </button>
//             {initialRating > 0 && selected === initialRating && (
//               <button
//                 onClick={handleRemove}
//                 className="text-sm text-red-400 hover:underline"
//               >
//                 Remove rating
//               </button>
//             )}
//           </div>
//         </div>

//         {toast && (
//           <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-white text-black px-4 py-2 text-sm rounded shadow-md flex items-center gap-2">
//             {toast}
//             <button onClick={() => setToast("")}>
//               <X size={16} />
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
