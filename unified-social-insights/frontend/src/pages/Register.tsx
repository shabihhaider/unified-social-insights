import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Register = () => {
  const [searchParams] = useSearchParams();
  const [plan, setPlan] = useState('free'); // default
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // ✅ Read plan from query param on load
  useEffect(() => {
    const selectedPlan = searchParams.get('plan');
    if (selectedPlan) {
      setPlan(selectedPlan);
    }
  }, [searchParams]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5050/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, password, role: plan }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed');
        return;
      }

      localStorage.setItem('token', data.token);
      navigate('/onboarding');
    } catch (err) {
      setError('Network error');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-sm bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-4"
      >
        <h2 className="text-xl font-bold text-center text-gray-800 dark:text-white">Create an Account</h2>

        {plan && (
          <p className="text-sm text-center text-gray-500 dark:text-gray-400">
            You're registering for the <span className="font-medium text-blue-600">{plan.toUpperCase()}</span> plan.
          </p>
        )}

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="w-full px-4 py-2 border rounded dark:bg-gray-900 dark:text-white dark:border-gray-700"
          required
        />

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full px-4 py-2 border rounded dark:bg-gray-900 dark:text-white dark:border-gray-700"
          required
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full px-4 py-2 border rounded dark:bg-gray-900 dark:text-white dark:border-gray-700"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
