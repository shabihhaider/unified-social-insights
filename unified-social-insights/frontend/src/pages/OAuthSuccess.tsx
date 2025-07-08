import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OAuthSuccess = () => {
  const [params] = useSearchParams();
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get('token');
    if (token) {
      login(token).then((success) => {
        if (success) {
          navigate('/dashboard/overview'); // ✅ Go to dashboard
        } else {
          navigate('/login');
        }
      });
    } else {
      navigate('/login');
    }
  }, [params, login, navigate]);

  return (
    <div className="flex items-center justify-center h-screen text-center">
      <p className="text-gray-600 dark:text-gray-300">
        Logging you in via Google...
      </p>
    </div>
  );
};

export default OAuthSuccess;
