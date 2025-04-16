import { useRef, useState } from "react";
import { Loader2, UploadCloud } from "lucide-react";

export default function AvatarUpload({ value, onUpload, showToast }) {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value || "");

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) validateAndUpload(file);
  };

  const validateAndUpload = (file) => {
    if (!file.type.startsWith("image/")) {
      showToast("Please upload a valid image file", "error");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      showToast("⚠️ Max file size is 2MB", "error");
      return;
    }

    const img = new Image();
    img.onload = () => {
      const aspect = img.width / img.height;
      if (aspect < 0.9 || aspect > 1.1) {
        showToast("Image must be roughly square", "error");
        return;
      }
      uploadToCloudinary(file);
    };
    img.src = URL.createObjectURL(file);
  };

  const uploadToCloudinary = async (file) => {
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "unsigned_avatar_upload");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dgr0ojmnl/image/upload",
        { method: "POST", body: formData }
      );
      const data = await res.json();
      if (!data.secure_url) throw new Error();

      const transformed = data.secure_url.replace(
        "/upload/",
        "/upload/w_100,h_100,c_thumb,r_max/"
      );
      setPreview(transformed);
      onUpload?.(transformed);
      showToast(" Avatar uploaded");
    } catch {
      showToast(" Upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      className="bg-[#1a1a1a] p-4 rounded-lg border-2 border-dashed border-gray-600 hover:border-yellow-400 transition text-center cursor-pointer"
      onClick={() => fileRef.current?.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) validateAndUpload(file);
        }}
      />

      {uploading ? (
        <div className="flex justify-center items-center h-20 text-yellow-400">
          <Loader2 className="animate-spin w-6 h-6" />
          <span className="ml-3">Uploading...</span>
        </div>
      ) : (
        <>
          {preview ? (
            <img
              src={preview}
              alt="Avatar preview"
              className="w-20 h-20 mx-auto rounded-full border-2 border-yellow-500 object-cover mb-2"
            />
          ) : (
            <div className="flex flex-col items-center text-gray-400">
              <UploadCloud size={32} className="mb-1" />
              <span className="text-sm">Click or drag an image here</span>
              <span className="text-xs text-gray-500">Max size 2MB • 1:1 aspect</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
