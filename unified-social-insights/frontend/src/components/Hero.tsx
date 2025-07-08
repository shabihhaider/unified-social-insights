import React from 'react';
import { motion } from 'framer-motion';

interface HeroProps {
  onJoinWaitlist: () => void;
}

const Hero: React.FC<HeroProps> = ({ onJoinWaitlist }) => {
  return (
    <section className="relative bg-gradient-to-br from-white via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-24 lg:py-32 overflow-hidden text-gray-900 dark:text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col-reverse lg:flex-row items-center justify-between">
        
        {/* ✅ Text Content */}
        <motion.div
          className="text-center lg:text-left max-w-xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
            Unified Social Insights
            <span className="text-blue-600"> — All-in-One Analytics</span>
          </h1>

          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Unify your social data. Save hours. Make better decisions — all from a single, powerful dashboard.
          </p>

          <motion.button
            onClick={onJoinWaitlist}
            whileHover={{ scale: 1.05 }}
            className="mt-8 px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 transition"
          >
            Join the Waitlist
          </motion.button>
        </motion.div>

        {/* ✅ Hero Image */}
        <motion.div
          className="w-full max-w-lg lg:max-w-xl mb-12 lg:mb-0"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <img
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Placeholder dashboard preview"
            className="w-full h-auto rounded-xl shadow-xl ring-1 ring-black/10 dark:ring-white/10"
            loading="lazy"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
