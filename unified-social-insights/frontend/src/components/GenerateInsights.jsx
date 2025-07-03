import React, { useState, useRef } from "react";
import { fetchInsights } from "../utils/api";
import { Loader2, Lightbulb, AlertCircle } from "lucide-react";

const GenerateInsights = () => {
  const [formData, setFormData] = useState({
    account_name: "",
    followers: "",
    likes: "",
    comments: "",
    reach: "",
    top_post: "",
  });

  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState([]);
  const [error, setError] = useState(null);
  const resultsRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setInsights([]);

    try {
      const res = await fetchInsights({
        account_name: formData.account_name.trim(),
        recent_metrics: {
          followers: Number(formData.followers),
          likes: Number(formData.likes),
          comments: Number(formData.comments),
          reach: Number(formData.reach),
          top_post: formData.top_post.trim(),
        },
      });

      const formatted = res.insights
        .split(/\n+/)
        .filter((line) => line.trim().length > 0);

      setInsights(formatted);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 md:px-12">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">🚀 AI-Generated Insights</h1>
        <p className="text-gray-600 mb-6">
          Paste your latest metrics and we’ll generate tailored growth recommendations.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input
            type="text"
            name="account_name"
            placeholder="Account Name"
            value={formData.account_name}
            onChange={handleChange}
            className="border border-gray-300 px-4 py-2 rounded-lg w-full"
          />
          <input
            type="number"
            name="followers"
            placeholder="Followers"
            value={formData.followers}
            onChange={handleChange}
            className="border border-gray-300 px-4 py-2 rounded-lg w-full"
          />
          <input
            type="number"
            name="likes"
            placeholder="Likes"
            value={formData.likes}
            onChange={handleChange}
            className="border border-gray-300 px-4 py-2 rounded-lg w-full"
          />
          <input
            type="number"
            name="comments"
            placeholder="Comments"
            value={formData.comments}
            onChange={handleChange}
            className="border border-gray-300 px-4 py-2 rounded-lg w-full"
          />
          <input
            type="number"
            name="reach"
            placeholder="Reach"
            value={formData.reach}
            onChange={handleChange}
            className="border border-gray-300 px-4 py-2 rounded-lg w-full"
          />
          <input
            type="text"
            name="top_post"
            placeholder="Top Performing Post"
            value={formData.top_post}
            onChange={handleChange}
            className="col-span-1 md:col-span-2 border border-gray-300 px-4 py-2 rounded-lg w-full"
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || !formData.account_name}
          className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition disabled:opacity-50"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="animate-spin w-4 h-4" />
              Generating...
            </div>
          ) : (
            "Generate Insights"
          )}
        </button>

        {error && (
          <div className="mt-6 bg-red-100 text-red-700 px-4 py-3 rounded flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {insights.length > 0 && (
          <div ref={resultsRef} className="mt-10">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">🧠 Recommendations</h2>
            <div className="space-y-4">
              {insights.map((tip, index) => (
                <div
                  key={index}
                  className="bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-sm flex items-start gap-3"
                >
                  <Lightbulb className="text-blue-600 w-5 h-5 mt-1 shrink-0" />
                  <p className="text-gray-800 leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateInsights;
