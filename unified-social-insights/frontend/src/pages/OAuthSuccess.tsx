// src/pages/OAuthSuccess.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [status, setStatus] = useState('Logging you in...');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (!token) {
      setStatus('❌ No token found in URL');
      navigate('/');
      return;
    }

    const handleLogin = async () => {
      setStatus('🔐 Verifying token and fetching user...');
      const success = await login(token); // ✅ Await the promise

      if (success) {
        setStatus('✅ Login successful! Redirecting...');
        navigate('/instagram-insights');
      } else {
        setStatus('❌ Login failed. Please try again.');
        navigate('/login');
      }
    };

    handleLogin();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center text-gray-600">
      <p>{status}</p>
    </div>
  );
};

export default OAuthSuccess;