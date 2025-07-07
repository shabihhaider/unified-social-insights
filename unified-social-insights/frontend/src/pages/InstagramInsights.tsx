import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale);

const InsightCard = ({ title, value, color }: { title: string; value: number; color: string }) => (
  <motion.div
    className="bg-white rounded-xl shadow-lg p-6 w-full text-center border border-gray-200"
    whileHover={{ scale: 1.05 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <p className="text-gray-500 text-sm">{title}</p>
    <h2 className={`text-2xl font-bold ${color}`}>{value}</h2>
  </motion.div>
);

const InstagramInsights: React.FC = () => {
  const { user } = useAuth();
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Safe check for required user fields
    if (
      !user ||
      typeof user !== 'object' ||
      !('access_token' in user) ||
      !('instagram_account_id' in user) ||
      !('id' in user)
    ) {
      setError('Missing user info. Please login and select a page.');
      setLoading(false);
      return;
    }

    const fetchInsights = async () => {
      try {
        const res = await axios.post('http://localhost:5050/api/instagram/fetch-insights', {
          instagram_account_id: user.instagram_account_id,
          access_token: user.access_token,
          user_id: user.id,
        });
        const data = res.data as { data: any };
        setInsights(data.data);
      } catch (err: any) {
        console.error('❌ API error:', err);
        setError(err.response?.data?.error || 'Failed to fetch insights');
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        <div className="text-center">
          <p className="text-red-500 mb-4">⚠️ {error}</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        <p>No insights available. Try reconnecting your account.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="text-center">
          <button
            onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/select-page';
            }}
            className="bg-gray-200 text-sm text-blue-600 px-4 py-2 rounded hover:bg-gray-300 transition"
          >
            🔁 Switch Page
          </button>
        </div>

        {/* Profile Info */}
        <motion.div
          className="bg-white rounded-lg shadow-xl p-6 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-3xl font-bold text-gray-800">{insights.full_name || insights.name}</h1>
          <p className="text-gray-500 text-lg">@{insights.username}</p>
          {user && 'page_name' in user && (
            <p className="text-sm text-blue-600 mt-2">📄 Selected Page: {user.page_name}</p>
          )}
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <InsightCard title="Followers" value={insights.followers_count} color="text-indigo-600" />
          <InsightCard title="Following" value={insights.follows_count} color="text-green-600" />
          <InsightCard title="Posts" value={insights.media_count} color="text-yellow-600" />
        </div>

        {/* Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white p-6 rounded-xl shadow-xl mt-8"
        >
          <h2 className="text-xl font-semibold text-center mb-4">Engagement Overview</h2>
          <Bar
            data={{
              labels: ['Followers', 'Following', 'Posts'],
              datasets: [
                {
                  label: 'Instagram Stats',
                  backgroundColor: ['#6366f1', '#10b981', '#f59e0b'],
                  data: [
                    insights.followers_count,
                    insights.follows_count,
                    insights.media_count,
                  ],
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: { y: { beginAtZero: true } },
            }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default InstagramInsights;
