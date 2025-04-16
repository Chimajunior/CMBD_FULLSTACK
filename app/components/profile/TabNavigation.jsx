export default function TabNavigation({ tabs = [], activeTab, onChange }) {
  return (
    <div className="flex gap-4 mb-10 border-b border-gray-700">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`pb-2 text-sm font-semibold capitalize ${
            activeTab === tab
              ? "border-b-2 border-yellow-500 text-yellow-400"
              : "text-gray-400 hover:text-yellow-400"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
