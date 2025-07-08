// src/components/UpgradePrompt.tsx

const UpgradePrompt = () => {
  return (
    <div className="p-8 text-center">
      <h2 className="text-xl font-bold mb-2">Upgrade Required 🚀</h2>
      <p className="mb-4">This feature is only available for Pro and above plans.</p>
      <button className="px-4 py-2 bg-blue-600 text-white rounded">Upgrade Now</button>
    </div>
  );
};

export default UpgradePrompt;
