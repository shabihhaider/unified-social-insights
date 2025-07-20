import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OAuthSuccess = () => {
  const [params] = useSearchParams();
  const { token } = useAuth(); // Get current user's JWT/token from context
  const navigate = useNavigate();

  useEffect(() => {
    const code = params.get('code');
    if (code && token) {
      // This is Facebook connect flow
      fetch('http://localhost:5050/api/auth/facebook/callback', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code })
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            // Connected successfully, go to dashboard/accounts
            navigate('/dashboard/accounts');
          } else {
            // Show error or redirect
            navigate('/dashboard/accounts?error=oauth_failed');
          }
        });
    } else {
      // Not a Facebook connect, maybe Google login or error fallback
      const loginToken = params.get('token');
      if (loginToken) {
        // Standard login (Google, etc.)
        // Call your login method here if needed, then redirect
        // Example:
        // login(loginToken).then(() => navigate('/dashboard/overview'));
        navigate('/dashboard/overview');
      } else {
        navigate('/login');
      }
    }
  }, [params, token, navigate]);

  return (
    <div className="flex items-center justify-center h-screen text-center">
      <p className="text-gray-600 dark:text-gray-300">
        Connecting your account...
      </p>
    </div>
  );
};

export default OAuthSuccess;
