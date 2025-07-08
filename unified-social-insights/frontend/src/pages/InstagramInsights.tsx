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
    className="bg-white rounded-lg shadow-sm p-5 w-full border-l-4 border-blue-500 flex flex-col"
    whileHover={{ y: -5 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">{title}</p>
    <h2 className={`text-2xl font-bold text-gray-800 ${color}`}>{value}</h2>
    {subtext && <p className="text-xs text-gray-400 mt-auto pt-2">{subtext}</p>}
  </motion.div>
);

const TrendBadge = ({ trend, value }: { trend: 'up' | 'down' | 'stable'; value: number }) => {
  const colors = {
    up: 'bg-green-50 text-green-700 border-green-200',
    down: 'bg-red-50 text-red-700 border-red-200',
    stable: 'bg-gray-50 text-gray-700 border-gray-200'
  };
  const icons = { up: '↑', down: '↓', stable: '→' };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[trend]}`}>
      {icons[trend]} {Math.abs(value)}%
    </span>
  );
};

const InstagramInsights: React.FC = () => {
  const { user } = useAuth();
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [range, setRange] = useState(7);
  const [compare, setCompare] = useState(false);

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
          range,
          compare,
        });
        const data = res.data as { data: any };
        setInsights(data.data);
      } catch (err: any) {
        console.error('API error:', err);
        setError(err.response?.data?.error || 'Failed to fetch insights');
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [user, range, compare]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your insights...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading insights</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  if (!insights || !insights.profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Insights Available</h3>
          <p className="text-gray-600 mb-6">Please check your account connection and try again.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Refresh Data
          </button>
        </div>
      </div>
    );
  }

  const { profile, metrics = [], top_posts = [], analytics = {}, alerts = [], recommendations = {} } = insights;
  const page = profile?.page_info;
  const reachData = metrics.find((m: any) => m.name === 'reach');
  const impressionsData = metrics.find((m: any) => m.name === 'impressions');
  const reachPrev = metrics.find((m: any) => m.name === 'reach_prev');
  const impressionsPrev = metrics.find((m: any) => m.name === 'impressions_prev');

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Instagram Analytics Dashboard</h1>
            <p className="text-sm text-gray-500">Performance insights for your account</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                localStorage.removeItem('token');
                window.location.href = '/select-page';
              }}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <svg className="-ml-0.5 mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              Switch Account
            </button>
          </div>
        </div>

        {/* Profile Card */}
        <motion.div
          className="bg-white overflow-hidden shadow rounded-lg mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="px-4 py-5 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center">
              <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                  {profile.name.charAt(0)}
                </div>
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
                <p className="text-gray-500">@{profile.username}</p>
                {page && (
                  <div className="mt-4 flex items-center justify-center sm:justify-start space-x-4">
                    <img
                      src={page.picture}
                      alt="Page"
                      className="w-10 h-10 rounded-full border border-gray-200 shadow-sm"
                    />
                    <div className="text-left">
                      <p className="text-sm font-semibold text-gray-700">{page.name}</p>
                      <p className="text-xs text-gray-500">{page.category}</p>
                    </div>
                  </div>
                )}
                {user && typeof user === 'object' && 'page_name' in user && user.page_name && (
                  <p className="text-sm text-blue-600 mt-1">Connected Page: {user.page_name}</p>
                )}
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-auto grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Engagement Rate</p>
                  <p className="text-lg font-semibold text-gray-900">{profile.engagement_rate}%</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Reach Ratio</p>
                  <p className="text-lg font-semibold text-gray-900">{profile.reach_to_follower_ratio}%</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Alerts */}
        {alerts?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg mb-8"
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Performance Alerts</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  {alerts.map((alert: any, idx: number) => (
                    <p key={idx} className="mb-1">{alert.message}</p>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <InsightCard title="Total Followers" value={profile.followers_count} color="text-indigo-600" />
          <InsightCard title="Accounts Following" value={profile.follows_count} color="text-green-600" />
          <InsightCard title="Media Count" value={profile.media_count} color="text-yellow-600" />
          <InsightCard 
            title="Avg. Engagement Rate" 
            value={`${profile.engagement_rate}%`} 
            color="text-purple-600"
            subtext={recommendations?.engagement_status || 'Good engagement'} 
          />
        </div>

        {/* Growth Trends */}
        {analytics?.growth_trends && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white shadow overflow-hidden sm:rounded-lg mb-8"
          >
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Growth Trends</h3>
              <p className="mt-1 text-sm text-gray-500">7-day performance compared to previous period</p>
            </div>
            <div className="bg-white px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                {Object.entries(analytics.growth_trends).map(([metric, data]: [string, any]) => (
                  <div key={metric} className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-500 capitalize">{metric.replace('_', ' ')}</p>
                    <div className="mt-1 flex items-baseline justify-between">
                      <p className="text-2xl font-semibold text-gray-900">{data.current}</p>
                      <TrendBadge trend={data.trend} value={data.growthRate} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Performance Summary */}
        {analytics?.summary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white shadow overflow-hidden sm:rounded-lg mb-8"
          >
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Performance Summary</h3>
              <p className="mt-1 text-sm text-gray-500">Key metrics overview</p>
            </div>
            <div className="bg-white px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-500">Total Reach</p>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">{analytics.summary.total_reach}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-500">Total Impressions</p>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">{analytics.summary.total_impressions}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-500">Avg Likes/Post</p>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">{analytics.summary.avg_likes_per_post}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-500">Avg Comments/Post</p>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">{analytics.summary.avg_comments_per_post}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* AI Recommendations */}
        {recommendations && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white shadow overflow-hidden sm:rounded-lg mb-8"
          >
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Optimization Recommendations</h3>
              <p className="mt-1 text-sm text-gray-500">AI-powered suggestions to improve performance</p>
            </div>
            <div className="bg-white px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-blue-100 rounded-md p-2">
                      <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Best Posting Time</p>
                      <p className="text-lg font-semibold text-gray-900">{recommendations.best_posting_time}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-purple-100 rounded-md p-2">
                      <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path>
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Top Content Type</p>
                      <p className="text-lg font-semibold text-gray-900 capitalize">{recommendations.top_content_type}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Date Range Selector */}
        <div className="bg-white shadow sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Date Range</h3>
            <div className="mt-2 sm:flex sm:items-center sm:justify-between">
              <div className="max-w-xl text-sm text-gray-500">
                <p>Select the time period for your analytics data</p>
              </div>
              <div className="mt-3 sm:mt-0 sm:ml-16 sm:flex-shrink-0 flex flex-col sm:flex-row gap-4">
                <select
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={range}
                  onChange={(e) => setRange(parseInt(e.target.value))}
                >
                  <option value={7}>Last 7 days</option>
                  <option value={14}>Last 14 days</option>
                  <option value={30}>Last 30 days</option>
                </select>
                <div className="flex items-center">
                  <input
                    id="compare-toggle"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={compare}
                    onChange={(e) => setCompare(e.target.checked)}
                  />
                  <label htmlFor="compare-toggle" className="ml-2 block text-sm text-gray-700">
                    Compare with previous period
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reach & Impressions Chart */}
        {(reachData?.values?.length || impressionsData?.values?.length) && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white shadow overflow-hidden sm:rounded-lg"
          >
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Reach & Impressions Trend</h3>
              <p className="mt-1 text-sm text-gray-500">Performance over the selected time period</p>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <Line
                data={{
                  labels: reachData?.values?.map((v: any) => new Date(v.end_time).toLocaleDateString()) || [],
                  datasets: [
                    {
                      label: 'Reach',
                      backgroundColor: '#6366f1',
                      borderColor: '#6366f1',
                      data: reachData?.values?.map((v: any) => v.value),
                      fill: false,
                      tension: 0.4,
                    },
                    {
                      label: 'Impressions',
                      backgroundColor: '#10b981',
                      borderColor: '#10b981',
                      data: impressionsData?.values?.map((v: any) => v.value),
                      fill: false,
                      tension: 0.4,
                    },
                    ...(compare && reachPrev?.values?.length ? [{
                      label: 'Reach (Previous)',
                      backgroundColor: '#c7d2fe',
                      borderColor: '#c7d2fe',
                      borderDash: [5, 5],
                      data: reachPrev.values.map((v: any) => v.value),
                      fill: false,
                      tension: 0.4,
                    }] : []),
                    ...(compare && impressionsPrev?.values?.length ? [{
                      label: 'Impressions (Previous)',
                      backgroundColor: '#a7f3d0',
                      borderColor: '#a7f3d0',
                      borderDash: [5, 5],
                      data: impressionsPrev.values.map((v: any) => v.value),
                      fill: false,
                      tension: 0.4,
                    }] : []),
                  ],
                }}
                options={{ 
                  responsive: true, 
                  plugins: { 
                    legend: { 
                      position: 'top',
                      labels: {
                        usePointStyle: true,
                        padding: 20
                      }
                    },
                    tooltip: {
                      mode: 'index',
                      intersect: false,
                    }
                  },
                  scales: { 
                    y: { 
                      beginAtZero: true,
                      ticks: {
                        callback: (value: any) => value.toLocaleString(),
                      }
                    },
                    x: {
                      grid: {
                        display: false
                      }
                    }
                  },
                  interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                  }
                }}
              />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default InstagramInsights;