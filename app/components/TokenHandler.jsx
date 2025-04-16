import { useEffect } from "react";
import { useNavigate, useLocation } from "@remix-run/react";
import { toast } from "sonner";

export default function TokenHandler() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const originalFetch = window.fetch;

    window.fetch = async (...args) => {
      const response = await originalFetch(...args);

      // If token is expired or invalid
      if (response.status === 401) {
        localStorage.removeItem("token");

        toast.warning("Your session has expired. Please log in again.");

        const redirectPath = location.pathname + location.search;
        navigate(`/login?redirectTo=${encodeURIComponent(redirectPath)}`);
      }

      return response;
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, [navigate, location]);

  return null;
}
