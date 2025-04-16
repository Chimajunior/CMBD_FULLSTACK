import { useState } from "react";
import { useNavigate } from "@remix-run/react";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Eye, EyeOff, AlertTriangle } from "lucide-react";

export function LoginForm({ className, redirectTo = "/", ...props }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    

    
    
    try {
      const response = await fetch(`/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ [data.field || "general"]: data.error || "Login failed" });
        return;
      }

      const token = data.token;
      localStorage.setItem("token", token);
      document.cookie = `token=${token}; path=/; max-age=3600`;

      const decoded = JSON.parse(atob(token.split(".")[1]));
      const role = decoded.role;

      navigate(role === "admin" ? "/dashboard" : redirectTo);
    } catch (err) {
      setErrors({ general: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleLogin}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <h1 className="text-2xl font-bold text-center">Login to your account</h1>

      <div className="grid gap-4">
        {/* Identifier */}
        <div>
          <Label htmlFor="identifier">Username or Email</Label>
          <Input
            id="identifier"
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            placeholder="Username or email"
            className={cn(errors.identifier && "border-red-500")}
          />
          {errors.identifier && (
            <p className="text-sm text-red-500 mt-1">{errors.identifier}</p>
          )}
        </div>

        {/* Password */}
        <div className="relative">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => setCapsLockOn(e.getModifierState("CapsLock"))}
            onKeyUp={(e) => setCapsLockOn(e.getModifierState("CapsLock"))}
            required
            placeholder="Password"
            className={cn(errors.password && "border-red-500 pr-10")}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-[38px] right-3 text-gray-400 hover:text-yellow-400"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          {errors.password && (
            <p className="text-sm text-red-500 mt-1">{errors.password}</p>
          )}
          {capsLockOn && (
            <div className="text-yellow-400 text-xs mt-1 flex items-center gap-1">
              <AlertTriangle size={14} /> Caps Lock is ON
            </div>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-[#B8860B]"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>

        {errors.general && (
          <p className="text-center text-sm mt-1 text-red-500">
            {errors.general}
          </p>
        )}
      </div>
    </form>
  );
}
