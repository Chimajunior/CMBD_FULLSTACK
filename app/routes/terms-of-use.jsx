export default function TermsOfUse() {
    return (
      <div className="min-h-screen bg-[#121212] text-white px-6 pt-24 pb-16">
        <h1 className="text-3xl font-bold mb-4">Terms of Use</h1>
        <p className="mb-4 text-gray-300">
          Welcome to CMBD. By accessing or using this platform, you agree to comply with and be bound by the following terms.
        </p>
        <ul className="list-disc ml-6 text-gray-400 space-y-2">
          <li>You must be 13 years or older to use this site.</li>
          <li>Do not post harmful, abusive, or inappropriate content in reviews.</li>
          <li>Respect other users and their opinions.</li>
          <li>All content is for personal use only.</li>
        </ul>
        <p className="mt-4 text-gray-300">
          CMBD reserves the right to suspend accounts or restrict access if any of the above terms are violated.
        </p>
      </div>
    );
  }
  