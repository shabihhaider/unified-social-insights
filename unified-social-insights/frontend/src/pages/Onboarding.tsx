import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Onboarding: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleConnectInstagram = () => {
    // Replace with your actual Meta OAuth URL
    window.location.href = 'https://793f-103-115-196-231.ngrok-free.app/api/auth/facebook';
  };

  const handleSkip = () => {
    navigate('/dashboard');
  };

  return (
    <section className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center px-4">
      <motion.div
        className="bg-white dark:bg-gray-800 max-w-lg w-full p-8 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to Unified Social Insights 🎉
        </h1>

        <p className="text-gray-600 dark:text-gray-400 mb-2">
          Hello <span className="font-semibold">{user?.full_name || user?.email}</span>
        </p>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          You're on the <span className="text-blue-600 font-medium">{user?.role?.toUpperCase()}</span> plan.
        </p>

        <div className="space-y-4">
          <button
            onClick={handleConnectInstagram}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Connect Instagram Account
          </button>

          <button
            onClick={handleSkip}
            className="w-full py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            Skip for now
          </button>
        </div>
      </motion.div>
    </section>
  );
};

export default Onboarding;
