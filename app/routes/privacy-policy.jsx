export default function PrivacyPolicy() {
    return (
      <div className="min-h-screen bg-[#121212] text-white px-6 pt-24 pb-16">
        <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
        <p className="mb-4 text-gray-300">
          At CMBD, we value your privacy. We collect minimal data to improve user experience and ensure platform security.
          Your data is never sold or shared with third parties without your consent.
        </p>
        <p className="mb-2 text-gray-400">What we collect:</p>
        <ul className="list-disc ml-6 text-gray-400">
          <li>Email addresses for login and newsletters</li>
          <li>Search activity for improving recommendations</li>
          <li>Basic browser/device info for analytics</li>
        </ul>
        <p className="mt-4 text-gray-300">
          You can request to delete your account or data anytime. Please contact us if you have any questions about privacy.
        </p>
      </div>
    );
  }
  