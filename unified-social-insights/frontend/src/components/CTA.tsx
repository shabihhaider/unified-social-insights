import { useState } from 'react';
import { motion } from 'framer-motion';
import WaitlistModal from './WaitlistModal';

interface CTAProps {
  onJoinWaitlist: () => void;
}

const CTA: React.FC<CTAProps> = ({ onJoinWaitlist }) => {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20 px-4">
      <motion.div
        className="max-w-3xl mx-auto text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-4">
          Ready to Unlock Smarter Social Insights?
        </h2>
        <p className="text-lg text-white/90 mb-8">
          Join the waitlist and be the first to experience AI-powered analytics across your social platforms.
        </p>
        <button
          onClick={onJoinWaitlist}
          className="inline-block px-6 py-3 bg-white text-blue-700 font-semibold rounded-md shadow hover:bg-gray-100 transition"
        >
          Join the Waitlist
        </button>
      </motion.div>
    </section>
  );
};

export default CTA;
