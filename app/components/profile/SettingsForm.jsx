import { useEffect, useState } from "react";
import AvatarUpload from "./AvatarUpload";
import { Loader2, CheckCircle, Trash2 } from "lucide-react";

const API_BASE =
  typeof window !== "undefined"
    ? window.ENV?.VITE_API_URL
    : process.env.VITE_API_URL || "http://localhost:5000";


export default function SettingsForm({
  initialUsername,
  initialEmail,
  initialAvatar,
  token,
  onSave,
  showToast,
}) {
  const [newUsername, setNewUsername] = useState(initialUsername || "");
  const [newEmail, setNewEmail] = useState(initialEmail || "");
  const [newPassword, setNewPassword] = useState("");
  const [newAvatar, setNewAvatar] = useState(initialAvatar || "");
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [emailAvailable, setEmailAvailable] = useState(null);

  useEffect(() => {
    if (newUsername.length >= 3) {
      const timeout = setTimeout(() => {
        checkAvailability("username", newUsername, setUsernameAvailable);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [newUsername]);

  useEffect(() => {
    if (newEmail.includes("@")) {
      const timeout = setTimeout(() => {
        checkAvailability("email", newEmail, setEmailAvailable);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [newEmail]);

  const checkAvailability = async (type, value, setter) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/check?${type}=${value}`);
      const data = await res.json();
      setter(data?.available);
    } catch {
      setter(null);
    }
  };

  const handleUpdate = async () => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      const res = await fetch(`${API_BASE}/api/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: newUsername,
          email: newEmail,
          password: newPassword,
          avatar: newAvatar,
          bio,
        }),
      });

      if (res.ok) {
        onSave?.();
        setNewPassword("");
        setSaveSuccess(true);
        showToast("Profile updated");
      } else {
        const data = await res.json();
        showToast(data?.message || " Update failed", "error");
      }
    } catch {
      showToast(" Update failed", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirm = window.confirm("Are you sure you want to delete your account? This is permanent.");
    if (!confirm) return;

    try {
      const res = await fetch(`${API_BASE}/api/profile`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        localStorage.removeItem("token");
        window.location.href = "/signup";
      } else {
        showToast(" Failed to delete account", "error");
      }
    } catch {
      showToast(" Failed to delete account", "error");
    }
  };

  return (
    <div className="space-y-6 max-w-xl text-white">
      <h2 className="text-2xl font-bold mb-4">Profile Settings</h2>

      {/* Avatar */}
      <AvatarUpload value={newAvatar} onUpload={setNewAvatar} showToast={showToast} />

      {/* Username */}
      <div>
        <input
          type="text"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
          placeholder="Username"
          className="w-full bg-[#1a1a1a] text-white px-4 py-2 rounded"
        />
        {usernameAvailable === true && (
          <p className="text-green-500 text-sm mt-1"> Available</p>
        )}
        {usernameAvailable === false && (
          <p className="text-red-500 text-sm mt-1"> Taken</p>
        )}
      </div>

      {/* Email */}
      <div>
        <input
          type="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          placeholder="Email address"
          className="w-full bg-[#1a1a1a] text-white px-4 py-2 rounded"
        />
        {emailAvailable === true && (
          <p className="text-green-500 text-sm mt-1"> Available</p>
        )}
        {emailAvailable === false && (
          <p className="text-red-500 text-sm mt-1"> Already in use</p>
        )}
      </div>

      {/* Password */}
      <input
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="New Password"
        className="w-full bg-[#1a1a1a] text-white px-4 py-2 rounded"
      />

    

      {/* Save */}
      <div className="flex items-center gap-4 pt-2">
        <button
          onClick={handleUpdate}
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 py-2 rounded shadow"
        >
          {saving ? (
            <span className="flex items-center gap-2">
              <Loader2 className="animate-spin w-4 h-4" /> Saving...
            </span>
          ) : saveSuccess ? (
            <span className="flex items-center gap-2">
              <CheckCircle className="text-green-500 w-5 h-5" /> Saved
            </span>
          ) : (
            "Save Changes"
          )}
        </button>

        {/* Delete account */}
        <button
          onClick={handleDelete}
          className="flex items-center gap-1 text-sm text-red-500 hover:text-red-400"
        >
          <Trash2 className="w-4 h-4" /> Delete Account
        </button>
      </div>
    </div>
  );
}
