import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { socialAccountsAPI } from '../services/socialAccounts'; // <-- Add this

const FacebookCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const linked = searchParams.get('linked');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    if (error) {
      navigate(`/dashboard/accounts?error=${encodeURIComponent(errorDescription || error)}`);
      return;
    }

    if (token) {
      login(token).then(async (success) => {
        if (success) {
          // --- CONNECT FACEBOOK ACCOUNT LOGIC STARTS HERE ---
          try {
            const pageDataRaw = localStorage.getItem('fb_selected_page');
            if (pageDataRaw) {
              const pageData = JSON.parse(pageDataRaw);
              await socialAccountsAPI.connectAccount('facebook', pageData.page_token, pageData);
              localStorage.removeItem('fb_selected_page');
            }
          } catch (err) {
            console.error('Failed to connect Facebook account:', err);
          }
          // --- END ---

          navigate(`/dashboard/accounts?linked=${linked || 'facebook'}`);
        } else {
          navigate('/login');
        }
      });
    } else {
      navigate('/dashboard/accounts?error=No authorization token received');
    }
  }, [searchParams, navigate, login]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p>Connecting your Facebook account...</p>
      </div>
    </div>
  );
};

export default FacebookCallback;
