// ✅ Enhanced InstagramInsights.tsx with detailed insights UI
// Features: Reach & Impressions trend chart, Top Posts, Growth trends, and AI-powered insights
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const InsightCard = ({ title, value, color, subtext }: { title: string; value: number | string; color: string; subtext?: string }) => (
  <motion.div
    className="bg-white rounded-xl shadow-lg p-6 w-full text-center border border-gray-200"
    whileHover={{ scale: 1.05 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <p className="text-gray-500 text-sm">{title}</p>
    <h2 className={`text-2xl font-bold ${color}`}>{value}</h2>
    {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
  </motion.div>
);

const TrendBadge = ({ trend, value }: { trend: 'up' | 'down' | 'stable'; value: number }) => {
  const colors = {
    up: 'bg-green-100 text-green-800',
    down: 'bg-red-100 text-red-800',
    stable: 'bg-gray-100 text-gray-800'
  };
  const icons = { up: '↗️', down: '↘️', stable: '→' };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[trend]}`}>
      {icons[trend]} {Math.abs(value)}%
    </span>
  );
};

const InstagramInsights: React.FC = () => {
  const { user } = useAuth();
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
        const res = await axios.post('http://localhost:5050/api/instagram/fetch-detailed-insights', {
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

  if (!insights || !insights.profile) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        <p>No insights available. Try reconnecting your account.</p>
      </div>
    );
  }

  const { profile, metrics = [], top_posts = [], analytics = {}, alerts = [], recommendations = {} } = insights;
  const reachData = metrics.find((m: any) => m.name === 'reach');
  const impressionsData = metrics.find((m: any) => m.name === 'impressions');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-12 px-6">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header */}
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

        {/* Profile */}
        <motion.div
          className="bg-white rounded-lg shadow-xl p-6 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-3xl font-bold text-gray-800">{profile.name}</h1>
          <p className="text-gray-500 text-lg">@{profile.username}</p>
          {user && typeof user === 'object' && 'page_name' in user && user.page_name && (
            <p className="text-sm text-blue-600 mt-2">📄 Selected Page: {user.page_name}</p>
          )}
          <div className="mt-4 flex justify-center gap-4">
            <span className="text-sm text-gray-600">📊 Engagement Rate: {profile.engagement_rate}%</span>
            <span className="text-sm text-gray-600">📈 Reach Ratio: {profile.reach_to_follower_ratio}%</span>
          </div>
        </motion.div>

        {/* Alerts */}
        {alerts?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 p-4 rounded-lg"
          >
            <h3 className="font-semibold text-yellow-800 mb-2">📢 Performance Alerts</h3>
            {alerts.map((alert: any, idx: number) => (
              <p key={idx} className="text-sm text-yellow-700">{alert.message}</p>
            ))}
          </motion.div>
        )}

        {/* Enhanced Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <InsightCard title="Followers" value={profile.followers_count} color="text-indigo-600" />
          <InsightCard title="Following" value={profile.follows_count} color="text-green-600" />
          <InsightCard title="Posts" value={profile.media_count} color="text-yellow-600" />
          <InsightCard 
            title="Avg Engagement" 
            value={`${profile.engagement_rate}%`} 
            color="text-purple-600"
            subtext={recommendations?.engagement_status || 'good'}
          />
        </div>

        {/* Growth Trends */}
        {analytics?.growth_trends && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-xl"
          >
            <h2 className="text-xl font-semibold mb-4">📈 Growth Trends (7-day)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(analytics.growth_trends).map(([metric, data]: [string, any]) => (
                <div key={metric} className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 capitalize">{metric}</p>
                  <p className="text-lg font-bold text-gray-800">{data.current}</p>
                  <TrendBadge trend={data.trend} value={data.growthRate} />
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Performance Summary */}
        {analytics?.summary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-xl"
          >
            <h2 className="text-xl font-semibold mb-4">📊 Performance Summary</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div><p className="text-sm text-gray-600">Total Reach</p><p className="text-lg font-bold">{analytics.summary.total_reach}</p></div>
              <div><p className="text-sm text-gray-600">Total Impressions</p><p className="text-lg font-bold">{analytics.summary.total_impressions}</p></div>
              <div><p className="text-sm text-gray-600">Avg Likes/Post</p><p className="text-lg font-bold">{analytics.summary.avg_likes_per_post}</p></div>
              <div><p className="text-sm text-gray-600">Avg Comments/Post</p><p className="text-lg font-bold">{analytics.summary.avg_comments_per_post}</p></div>
            </div>
          </motion.div>
        )}

        {/* AI Recommendations */}
        {recommendations && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200"
          >
            <h2 className="text-xl font-semibold mb-4">🤖 AI Recommendations</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">🕐 Best Posting Time</p>
                <p className="font-semibold text-blue-700">{recommendations.best_posting_time}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">🎯 Top Content Type</p>
                <p className="font-semibold text-green-700 capitalize">{recommendations.top_content_type}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Enhanced Chart */}
        {(reachData?.values?.length || impressionsData?.values?.length) && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white p-6 rounded-xl shadow-xl mt-8"
          >
            <h2 className="text-xl font-semibold text-center mb-4">📈 Reach & Impressions Trend</h2>
            <Line
              data={{
                labels: reachData?.values?.map((v: any) => new Date(v.end_time).toLocaleDateString()) || [],
                datasets: [
                  ...(reachData?.values?.length ? [{
                    label: 'Reach',
                    backgroundColor: '#6366f1',
                    borderColor: '#6366f1',
                    data: reachData.values.map((v: any) => v.value),
                    fill: false,
                  }] : []),
                  ...(impressionsData?.values?.length ? [{
                    label: 'Impressions',
                    backgroundColor: '#10b981',
                    borderColor: '#10b981',
                    data: impressionsData.values.map((v: any) => v.value),
                    fill: false,
                  }] : []),
                ],
              }}
              options={{ 
                responsive: true, 
                plugins: { legend: { display: true } },
                scales: { y: { beginAtZero: true } }
              }}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default InstagramInsights;