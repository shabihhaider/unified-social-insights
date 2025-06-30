import React, { useEffect, useState } from 'react';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';

interface MediaItem {
  id: string;
  caption: string;
  media_url: string;
  like_count: number;
  comments_count: number;
}

interface Props {
  ig_id: string;
}

const InstagramMedia: React.FC<Props> = ({ ig_id }) => {
  const { token } = useAuth();
  const [media, setMedia] = useState<MediaItem[]>([]);

  useEffect(() => {
    if (!ig_id || !token) return;

    axios
      .get(`/api/meta/media?ig_id=${ig_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setMedia((res.data as { media: MediaItem[] }).media))
      .catch(err => console.error('❌ Failed to load media', err));
  }, [ig_id, token]);

  if (!media.length) return <p>No posts found.</p>;

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-2">📷 Recent Instagram Posts</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {media.map(post => (
          <div key={post.id} className="bg-white shadow rounded overflow-hidden">
            <img src={post.media_url} alt={post.caption} className="w-full h-48 object-cover" />
            <div className="p-3 space-y-1">
              <p className="text-sm font-semibold truncate">{post.caption}</p>
              <p className="text-xs text-gray-600">❤️ {post.like_count}   💬 {post.comments_count}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InstagramMedia;
