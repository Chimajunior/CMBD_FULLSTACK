export default function ToastBanner({ message, type }) {
  if (!message) return null;
  return (
    <div
      className={`fixed top-5 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded z-50 font-semibold shadow ${
        type === "error" ? "bg-red-500" : "bg-green-600"
      }`}
    >
      {message}
    </div>
  );
}
