import React, { useEffect, useState } from 'react';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import InstagramMedia from '../components/InstagramMedia';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface Page {
  page_id: string;
  page_name: string;
  ig_id: string;
  access_token: string;
}

interface Metrics {
  followers_count: number;
  impressions: number;
  reach: number;
  profile_views: number;
  website_clicks: number;
}

const Dashboard: React.FC = () => {
  const { token, user, logout } = useAuth();
  const [pages, setPages] = useState<Page[]>([]);
  const [selected, setSelected] = useState<Page | null>(null);
  const [metrics, setMetrics] = useState<Metrics | null>(null);

  // Fetch pages on load
  useEffect(() => {
    if (!token) return;
    axios
      .get('/api/meta/mock-pages', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        const data = res.data as { pages: Page[] };
        setPages(data.pages);
        if (data.pages.length > 0) {
          setSelected(data.pages[0]); // auto-select first
        }
      });
  }, [token]);

  // Fetch insights when page selected
  useEffect(() => {
    if (!selected || !token) return;
    axios
      .get(`/api/meta/insights?ig_id=${selected.ig_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        const data = res.data as { metrics: Metrics };
        setMetrics(data.metrics);
      })
      .catch(err => console.error('❌ Error loading insights:', err));
  }, [selected, token]);

  if (!user) return <p className="text-center">Not authenticated</p>;

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Welcome {user.email || `User ID: ${user.id}`}</h1>
        <button onClick={logout} className="text-red-500 underline">Logout</button>
      </div>

      {/* Page dropdown */}
      <div>
        <label className="font-semibold">Select Page:</label>
        <select
          value={selected?.page_id || ''}
          onChange={e => {
            const page = pages.find(p => p.page_id === e.target.value);
            if (page) setSelected(page);
          }}
          className="border p-2 ml-2"
        >
          {pages.map(page => (
            <option key={page.page_id} value={page.page_id}>
              {page.page_name}
            </option>
          ))}
        </select>
      </div>

      {/* Stat cards */}
      {metrics && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-blue-100 p-4 rounded shadow">📊 Followers: <b>{metrics.followers_count}</b></div>
          <div className="bg-green-100 p-4 rounded shadow">📈 Impressions: <b>{metrics.impressions}</b></div>
          <div className="bg-yellow-100 p-4 rounded shadow">👥 Reach: <b>{metrics.reach}</b></div>
          <div className="bg-purple-100 p-4 rounded shadow">👀 Profile Views: <b>{metrics.profile_views}</b></div>
          <div className="bg-pink-100 p-4 rounded shadow">🔗 Website Clicks: <b>{metrics.website_clicks}</b></div>
        </div>
      )}

      {/* Chart */}
      {metrics && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Instagram Analytics</h2>
          <Bar
            data={{
              labels: ['Followers', 'Impressions', 'Reach', 'Profile Views', 'Website Clicks'],
              datasets: [
                {
                  label: 'Count',
                  data: [
                    metrics.followers_count,
                    metrics.impressions,
                    metrics.reach,
                    metrics.profile_views,
                    metrics.website_clicks,
                  ],
                  backgroundColor: '#3b82f6',
                },
              ],
            }}
          />
        </div>
      )}

      {selected && <InstagramMedia ig_id={selected.ig_id} />}

    </div>
  );
};

export default Dashboard;
