import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";

export default function MovieModal({ open, onClose, onSubmit, editingMovie, token }) {
  const [form, setForm] = useState({
    title: "",
    poster_url: "",
    description: "",
    release_date: "",
    cast: "",
    genre: "",
  });

  const [errors, setErrors] = useState({});

  const isEdit = !!editingMovie;

  useEffect(() => {
    if (editingMovie) {
      setForm({
        title: editingMovie.title || "",
        poster_url: editingMovie.poster_url || "",
        description: editingMovie.description || "",
        release_date: editingMovie.release_date?.split("T")[0] || "",
        cast: editingMovie.cast || "",
        genre: editingMovie.genre || "",
      });
    } else {
      setForm({
        title: "",
        poster_url: "",
        description: "",
        release_date: "",
        cast: "",
        genre: "",
      });
    }
    setErrors({});
  }, [editingMovie]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // clear error on change
  };

  const handleSubmit = async () => {
    const required = ["title", "poster_url", "description", "release_date", "cast", "genre"];
    const newErrors = {};

    required.forEach((field) => {
      if (!form[field]?.trim()) {
        newErrors[field] = "This field is required.";
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fill in all fields.");
      return;
    }

    const API_BASE = import.meta.env.VITE_API_URL;

try {
  const res = await fetch(
    isEdit
      ? `${API_BASE}/api/movies/${editingMovie.id}`
      : `${API_BASE}/api/movies`,
    {
      method: isEdit ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    }
  );


      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Something went wrong.");
        return;
      }

      toast.success(isEdit ? "Movie updated!" : "Movie added!");
      onSubmit(isEdit ? { ...editingMovie, ...form } : data.movie, isEdit);
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit movie.");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-[#1a1a1a] p-6 rounded-lg w-[95%] max-w-lg relative border border-gray-700">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold text-yellow-400 mb-4">
          {isEdit ? "Edit Movie" : "Add New Movie"}
        </h2>

        <div className="space-y-3">
          {["title", "poster_url", "description", "release_date", "cast", "genre"].map((field) => (
            <div key={field}>
              <label className="block text-sm mb-1 capitalize">
                {field.replace("_", " ")}
              </label>
              <input
                name={field}
                value={form[field]}
                onChange={handleChange}
                type={field === "release_date" ? "date" : "text"}
                className={`w-full px-3 py-2 bg-[#262626] text-white rounded border ${
                  errors[field] ? "border-red-500" : "border-gray-600"
                } focus:outline-none focus:ring-2 ${
                  errors[field] ? "focus:ring-red-500" : "focus:ring-yellow-500"
                }`}
              />
              {errors[field] && (
                <p className="text-red-500 text-xs mt-1">{errors[field]}</p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-yellow-500 text-black font-bold px-4 py-2 rounded hover:bg-yellow-600"
          >
            {isEdit ? "Update" : "Add Movie"}
          </button>
        </div>
      </div>
    </div>
  );
}
