import React from 'react';
import { motion } from 'framer-motion';

const Insights = () => {
  return (
    <motion.div
      className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">📈 Instagram Insights</h1>
      <p className="text-gray-600 dark:text-gray-300">
        Dive into detailed analytics, engagement metrics, and growth trends across your connected Instagram accounts.
      </p>
    </motion.div>
  );
};

export default Insights;
