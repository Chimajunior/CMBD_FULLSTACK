import { showToast } from "../components/Toast"; // import your toast

export async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem("token");

  if (!options.headers) options.headers = {};
  if (token) options.headers.Authorization = `Bearer ${token}`;

  try {
    const res = await fetch(url, options);

    if (res.status === 401) {
      showToast(" Session expired. Please log in again.");
      // Save the current location
      const currentPath = window.location.pathname + window.location.search;
      localStorage.setItem("redirectAfterLogin", currentPath);
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
      return null;
    }

    return res;
  } catch (err) {
    console.error("Global Fetch Error:", err);
    showToast("⚠️ Network error. Try again.");
    return null;
  }
}
