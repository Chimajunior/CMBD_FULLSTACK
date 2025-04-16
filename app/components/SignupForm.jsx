import { useState } from "react";
import { useNavigate, useSearchParams } from "@remix-run/react";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Eye, EyeOff } from "lucide-react";

export function SignupForm({ className, ...props }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/";

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (pw) =>
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/.test(pw);

  async function handleSignup(e) {
    e.preventDefault();
    setErrors({});

    const newErrors = {};
    if (!username.trim()) newErrors.username = "Username is required";
    if (!validateEmail(email)) newErrors.email = "Enter a valid email address";
    if (!validatePassword(password))
      newErrors.password =
        "Password must have 8+ chars, uppercase, lowercase, number & symbol";
    if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // const API_BASE =
    // typeof window !== "undefined"
    //   ? window.ENV?.VITE_API_URL
    //   : process.env.VITE_API_URL || "http://localhost:5000";
    
setLoading(true);
const res = await fetch(`/api/auth/register`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username, email, password }),
});

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setErrors({ success: "Signup successful! Redirecting..." });
      setTimeout(() => navigate(`/login?redirectTo=${redirectTo}`), 1500);
    } else {
      // support { field, error } style
      if (data.field && data.error) {
        setErrors({ [data.field]: data.error });
      } else {
        setErrors({ general: data.error || "Signup failed" });
      }
    }
  }

  return (
    <form
      onSubmit={handleSignup}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <h1 className="text-2xl font-bold text-center">Create an account</h1>

      <div className="grid gap-4">
        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={cn(errors.username && "border-red-500")}
            placeholder="Your username"
          />
          {errors.username && (
            <p className="text-sm text-red-500 mt-1">{errors.username}</p>
          )}
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={cn(errors.email && "border-red-500")}
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email}</p>
          )}
        </div>

        <div className="relative">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={cn(errors.password && "border-red-500 pr-10")}
            placeholder="Password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-gray-400 hover:text-yellow-400"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          {errors.password && (
            <p className="text-sm text-red-500 mt-1">{errors.password}</p>
          )}
        </div>

        <div className="relative">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type={showConfirm ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={cn(errors.confirmPassword && "border-red-500 pr-10")}
            placeholder="Confirm password"
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-9 text-gray-400 hover:text-yellow-400"
          >
            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          {errors.confirmPassword && (
            <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>
          )}
        </div>

        <Button type="submit" className="w-full bg-[#B8860B]" disabled={loading}>
          {loading ? "Creating..." : "Signup"}
        </Button>

        {errors.general && (
          <p className="text-center text-sm mt-1 text-red-500">
            {errors.general}
          </p>
        )}
        {errors.success && (
          <p className="text-center text-sm mt-1 text-green-400">
            {errors.success}
          </p>
        )}
      </div>
    </form>
  );
}
