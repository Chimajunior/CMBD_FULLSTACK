import { useEffect } from "react";
import { useSearchParams, useNavigate } from "@remix-run/react";
import { LoginForm } from "../components/LoginForm";

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/";
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate(redirectTo);
  }, [redirectTo, navigate]);

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10 bg-[#121212] text-white">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/" className="flex items-center gap-2 text-2xl font-bold">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              CMBD
            </div>
          </a>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm redirectTo={redirectTo} />
          </div>
        </div>

        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <a
            href={`/signup?redirectTo=${encodeURIComponent(redirectTo)}`}
            className="underline underline-offset-4"
          >
            Sign up
          </a>
        </div>
      </div>

      <div className="relative hidden bg-muted lg:block">
        <img
          src="/godzilla.jpeg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
