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

  // Fetch mock pages
  useEffect(() => {
    if (!token) return;
    axios
      .get('/api/meta/mock-pages', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        const data = res.data as { pages: Page[] };
        setPages(data.pages);
        if (data.pages.length) {
          setSelected(data.pages[0]);
        }
      })
      .catch(err => console.error('Pages fetch error:', err));
  }, [token]);

  // Fetch insights for selected page
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
      .catch(err => console.error('Insights fetch error:', err));
  }, [selected, token]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">📊 Unified Social Insights</h1>
      <p className="mb-2 text-gray-600">Welcome {user?.email || 'User'}</p>
      <button onClick={logout} className="bg-red-500 text-white px-4 py-1 rounded mb-4">
        Logout
      </button>

      {pages.length > 1 && (
        <select
          className="border p-2 rounded mb-4"
          onChange={e => {
            const selectedPage = pages.find(p => p.page_id === e.target.value);
            setSelected(selectedPage || null);
          }}
          value={selected?.page_id}
        >
          {pages.map(p => (
            <option key={p.page_id} value={p.page_id}>
              {p.page_name}
            </option>
          ))}
        </select>
      )}

      {metrics ? (
        <div className="mt-6">
          <Bar
            data={{
              labels: ['Followers', 'Impressions', 'Reach', 'Profile Views', 'Website Clicks'],
              datasets: [
                {
                  label: 'Metrics',
                  data: [
                    metrics.followers_count,
                    metrics.impressions,
                    metrics.reach,
                    metrics.profile_views,
                    metrics.website_clicks,
                  ],
                  backgroundColor: [
                    '#3b82f6',
                    '#10b981',
                    '#f59e0b',
                    '#ef4444',
                    '#8b5cf6',
                  ],
                },
              ],
            }}
          />
        </div>
      ) : (
        <p>Loading metrics...</p>
      )}
    </div>
  );
};

export default Dashboard;
