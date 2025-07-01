import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();

  useEffect(() => {
    const url = new URL(window.location.href);
    const token = url.searchParams.get('token');

    if (token) {
      loginWithToken(token);
      navigate('/dashboard');
    } else {
      console.error('❌ No token found in URL');
      navigate('/login');
    }
  }, [navigate, loginWithToken]);

  return <p className="text-center mt-10 text-lg">🔄 Logging you in via Facebook...</p>;
};

export default OAuthSuccess;
