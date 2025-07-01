import React from 'react';
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

interface MediaItem {
  id: string;
  caption: string;
  like_count: number;
  comments_count: number;
}

interface Props {
  posts: MediaItem[];
}

const PostChart: React.FC<Props> = ({ posts }) => {
  if (!posts.length) return null;

  const labels = posts.map(p => p.caption.slice(0, 10) + '...');
  const likes = posts.map(p => p.like_count);
  const comments = posts.map(p => p.comments_count);

  return (
    <div className="mt-12">
      <h3 className="text-lg font-semibold mb-2">📊 Post Engagement Chart</h3>
      <Bar
        data={{
          labels,
          datasets: [
            {
              label: 'Likes',
              data: likes,
              backgroundColor: 'rgba(59,130,246,0.7)', // blue
            },
            {
              label: 'Comments',
              data: comments,
              backgroundColor: 'rgba(239,68,68,0.7)', // red
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom',
            },
          },
        }}
      />
    </div>
  );
};

export default PostChart;
