import React, { useState } from "react";
import { fetchInsights } from "../utils/api";

export default function GenerateInsights() {
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState(null);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setInsights(null);

    try {
      const response = await fetchInsights({
        account_name: "growthguru",
        recent_metrics: {
          followers: 1250,
          likes: 430,
          comments: 75,
          reach: 3200,
          top_post: "reel about marketing strategies",
        },
      });

      setInsights(response.insights);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-xl rounded-2xl border border-gray-200">
      <h2 className="text-xl font-semibold mb-4">AI-Generated Insights</h2>

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate Insights"}
      </button>

      {loading && (
        <div className="mt-4 text-sm text-gray-500">Thinking... 🤖</div>
      )}

      {error && (
        <div className="mt-4 text-red-600 text-sm">
          ❌ {error}
        </div>
      )}

      {insights && (
        <div className="mt-6 whitespace-pre-line text-sm text-gray-800 border-t pt-4">
          {insights}
        </div>
      )}
    </div>
  );
}
