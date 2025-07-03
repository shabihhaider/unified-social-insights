import React from "react";

const ConnectInstagram = () => {
  const handleConnect = () => {
    window.location.href = "http://localhost:5050/api/auth/facebook";
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md text-center">
      <h2 className="text-xl font-bold text-gray-800 mb-2">Link Your Instagram</h2>
      <p className="text-gray-600 mb-4">
        Securely connect your business Instagram account to fetch real insights.
      </p>
      <button
        onClick={handleConnect}
        className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
      >
        Connect Instagram
      </button>
    </div>
  );
};

export default ConnectInstagram;
