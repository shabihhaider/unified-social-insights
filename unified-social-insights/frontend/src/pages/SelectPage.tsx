import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import axios from '../utils/axios';

interface PageOption {
  page_id: string;
  page_name: string;
  page_token: string;
  instagram_account_id: string;
}

interface TempTokenPayload {
  email: string;
  access_token: string;
  pages: PageOption[];
  exp: number;
}

const SelectPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [pages, setPages] = useState<PageOption[]>([]);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const jwtToken = params.get('token');
    if (!jwtToken) {
      setError('Missing authentication token.');
      setTimeout(() => navigate('/login'), 2500);
      return;
    }

    setToken(jwtToken);

    try {
      const decoded = jwtDecode<TempTokenPayload>(jwtToken);
      if (!decoded.pages || !Array.isArray(decoded.pages)) {
        throw new Error('Missing pages in token');
      }
      setPages(decoded.pages);
    } catch (err) {
      console.error('❌ Failed to decode token:', err);
      setError('Invalid token. Redirecting...');
      setTimeout(() => navigate('/login'), 2500);
    }
  }, [params, navigate]);


  const handlePageSelect = async (page: PageOption) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('/api/auth/finalize-page', {
        token,
        selected_page: page,
      });

      const data = res.data as { token: string };
      const finalToken = data.token;
      await login(finalToken);
      navigate('/dashboard/overview');
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Something went wrong.';
      setError(msg);
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md mx-4"
        >
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Back to Login
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">📄</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Select Your Page</h1>
          <p className="text-gray-600">Choose a Facebook page with an Instagram business account</p>
        </div>

        <div className="grid gap-4">
          {pages.map((page, index) => (
            <motion.button
              key={page.page_id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handlePageSelect(page)}
              disabled={loading}
              className={`p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all text-left border-2 hover:border-indigo-200 ${
                loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {page.page_name}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-4">📘 Page ID: {page.page_id}</span>
                    <span>📷 Instagram: {page.instagram_account_id}</span>
                  </div>
                </div>
                <div className="text-indigo-600 text-2xl">
                  {loading ? '⏳' : '→'}
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {pages.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-600">
              No pages found. Make sure your Facebook page is linked to an Instagram business account.
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default SelectPage;
