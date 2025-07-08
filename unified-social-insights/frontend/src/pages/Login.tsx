import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ Use context login

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5050/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
        return;
      }

      // ✅ Use context login to set user and token
      const success = await login(data.token);
      if (success) {
        navigate('/dashboard/overview'); // ✅ Redirect here
      } else {
        setError('Authentication failed');
      }
    } catch (err) {
      console.error(err);
      setError('Network error. Please try again.');
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5050/api/auth/google';
  };

  const handleFacebookLogin = () => {
    window.location.href = 'https://793f-103-115-196-231.ngrok-free.app/api/auth/facebook/';
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Login to Unified Social Insights
      </h1>

      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-4">
          <button
            onClick={handleGoogleLogin}
            className="w-full bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 px-6 py-3 rounded-lg shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            Continue with Google
          </button>
          <button
            onClick={handleFacebookLogin}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition"
          >
            Continue with Facebook
          </button>
        </div>

        <div className="text-center text-gray-500 dark:text-gray-400 text-sm">or login with email</div>

        <form onSubmit={handleEmailLogin} className="space-y-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            required
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Login with Email
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
