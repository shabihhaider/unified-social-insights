import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Sparkles, Users } from 'lucide-react';

interface HeroProps {
  onJoinWaitlist: () => void;
}

const Hero: React.FC<HeroProps> = ({ onJoinWaitlist }) => {
  return (
    <section className="relative bg-gradient-to-br from-brand-pure via-brand-frost/30 to-brand-frost/50 dark:bg-brand-gradient py-24 lg:py-36 overflow-hidden">
      {/* Enhanced animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-brand-electric/10 dark:bg-brand-neon/10 rounded-full blur-3xl animate-float" />
        <div className="absolute top-40 right-20 w-48 h-48 bg-brand-violet/15 dark:bg-brand-electric/15 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-brand-neon/20 dark:bg-brand-violet/10 rounded-full blur-2xl animate-bounce-subtle" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-brand-lime/15 dark:bg-brand-lime/5 rounded-full blur-xl animate-float" style={{ animationDelay: '0.5s' }} />
      </div>

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-electric/5 via-transparent to-brand-neon/5 dark:bg-brand-radial opacity-20 dark:opacity-30" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Enhanced Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-brand-electric/10 to-brand-neon/10 dark:from-brand-frost/10 dark:to-brand-electric/10 backdrop-blur-sm border border-brand-electric/20 dark:border-brand-frost/20 text-brand-electric dark:text-brand-frost text-sm font-medium mb-6 shadow-brand hover:shadow-brand-lg transition-all duration-300 hover:scale-105"
        >
          <Sparkles size={16} className="animate-pulse" />
          <span>AI-Powered Social Analytics</span>
        </motion.div>

        {/* Enhanced Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6"
        >
          <span className="block text-brand-void dark:text-brand-pure">Unified Social</span>
          <span className="block bg-brand-electric bg-clip-text text-transparent animate-gradient bg-300%">
            Insights
          </span>
          <span className="block text-2xl sm:text-3xl font-semibold text-brand-zinc dark:text-brand-frost mt-2">
            All-in-One Analytics
          </span>
        </motion.h1>

        {/* Enhanced Description */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-lg lg:text-xl text-brand-zinc/80 dark:text-brand-frost leading-relaxed mb-10"
        >
          Unify your social data. Save hours. Make better decisions — all from a single, powerful dashboard that grows with your business.
        </motion.p>

        {/* Enhanced CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-10"
        >
          <motion.button
            onClick={onJoinWaitlist}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative px-8 py-4 bg-brand-electric hover:bg-brand-neon text-brand-pure font-semibold rounded-xl shadow-brand-lg hover:shadow-electric-glow transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-electric focus:ring-offset-2 dark:focus:ring-offset-brand-void flex items-center justify-center gap-2 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-pure/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <span className="relative">Join the Waitlist</span>
            <ArrowRight size={20} className="relative group-hover:translate-x-1 transition-transform duration-200" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group px-8 py-4 bg-brand-pure/90 dark:bg-brand-void/90 backdrop-blur-sm text-brand-electric dark:text-brand-frost border border-brand-electric/30 dark:border-brand-frost/20 font-semibold rounded-xl hover:bg-brand-frost/30 dark:hover:bg-brand-carbon/30 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-electric focus:ring-offset-2 dark:focus:ring-offset-brand-void flex items-center justify-center gap-2 shadow-brand hover:shadow-brand-lg"
          >
            <Play size={20} className="group-hover:scale-110 transition-transform duration-200" />
            <span>Watch Demo</span>
          </motion.button>
        </motion.div>

        {/* Enhanced Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-6 text-sm text-brand-zinc/70 dark:text-brand-frost"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-brand-lime rounded-full animate-pulse" />
            <span>Free 14-day trial</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-brand-electric rounded-full animate-pulse" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={14} className="text-brand-electric" />
            <span>10K+ users</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;