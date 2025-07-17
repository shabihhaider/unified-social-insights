import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { ArrowRight, Sparkles, TrendingUp, Users, Zap, CheckCircle2, Star, Clock } from 'lucide-react';
import WaitlistModal from './WaitlistModal';

interface CTAProps {
  onJoinWaitlist: () => void;
}

const CTA: React.FC<CTAProps> = ({ onJoinWaitlist }) => {
  const { theme } = useTheme();

  const benefits = [
    { icon: CheckCircle2, text: '14-day free trial', highlight: true },
    { icon: CheckCircle2, text: 'No credit card required', highlight: false },
    { icon: CheckCircle2, text: 'Cancel anytime', highlight: false },
    { icon: Star, text: 'Early access bonus features', highlight: true }
  ];

  const urgencyStats = [
    { value: '2,847', label: 'People waiting', icon: Users },
    { value: '72h', label: 'Avg wait time', icon: Clock },
    { value: '4.9/5', label: 'Beta rating', icon: Star }
  ];

  return (
    <section className="relative py-24 overflow-hidden bg-brand-electric dark:bg-brand-gradient">
      {/* Enhanced background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-40 h-40 bg-brand-neon/20 dark:bg-brand-electric/15 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-1/2 right-20 w-56 h-56 bg-brand-violet/25 dark:bg-brand-neon/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 left-1/3 w-32 h-32 bg-brand-lime/30 dark:bg-brand-violet/10 rounded-full blur-2xl animate-bounce-subtle"></div>
        <div className="absolute top-1/4 right-1/4 w-24 h-24 bg-brand-pure/20 dark:bg-brand-frost/8 rounded-full blur-2xl animate-float" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Enhanced grid pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255, 255, 255, 0.3) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Enhanced floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/6 w-16 h-16 bg-gradient-to-br from-brand-pure/30 to-brand-neon/30 rounded-2xl backdrop-blur-sm border border-brand-pure/20 flex items-center justify-center shadow-brand"
        >
          <TrendingUp className="text-brand-pure w-8 h-8" />
        </motion.div>

        <motion.div
          animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-1/3 right-1/6 w-20 h-20 bg-gradient-to-br from-brand-lime/30 to-brand-pure/30 rounded-2xl backdrop-blur-sm border border-brand-pure/30 flex items-center justify-center shadow-brand"
        >
          <Users className="text-brand-pure w-10 h-10" />
        </motion.div>

        <motion.div
          animate={{ y: [0, -10, 0], x: [0, 5, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-1/4 left-1/4 w-12 h-12 bg-gradient-to-br from-brand-violet/40 to-brand-neon/40 rounded-xl backdrop-blur-sm border border-brand-pure/30 flex items-center justify-center shadow-brand"
        >
          <Zap className="text-brand-pure w-6 h-6" />
        </motion.div>

        {/* Additional floating elements */}
        <motion.div
          animate={{ y: [0, 12, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute bottom-1/3 right-1/3 w-14 h-14 bg-gradient-to-br from-brand-amber/30 to-brand-lime/30 rounded-full backdrop-blur-sm border border-brand-pure/20 flex items-center justify-center shadow-brand"
        >
          <Star className="text-brand-pure w-7 h-7" />
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto px-4 relative">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {/* Enhanced badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-pure/20 dark:bg-brand-void/40 backdrop-blur-sm border border-brand-pure/30 dark:border-brand-frost/20 text-brand-pure text-sm font-medium mb-8 shadow-brand"
          >
            <div className="relative">
              <Sparkles size={16} className="animate-glow" />
              <div className="absolute inset-0 animate-ping opacity-30">
                <Sparkles size={16} />
              </div>
            </div>
            <span>Join 10,000+ Social Media Professionals</span>
          </motion.div>

          {/* Enhanced heading */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 text-brand-pure"
          >
            Ready to Unlock{' '}
            <span className="relative">
              <span className="bg-gradient-to-r from-brand-pure via-brand-lime to-brand-neon dark:from-brand-pure dark:via-brand-neon dark:to-brand-lime bg-clip-text text-transparent animate-gradient bg-300% font-black">
                Smarter Social Insights
              </span>
              {/* Enhanced text shadow for better visibility */}
              <div className="absolute inset-0 bg-gradient-to-r from-brand-pure/30 to-brand-lime/30 blur-lg opacity-70 -z-10"></div>
              {/* Additional contrast layer */}
              <div className="absolute inset-0 text-brand-pure/20 font-black blur-sm -z-20">
                Smarter Social Insights
              </div>
            </span>
            ?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg lg:text-xl text-brand-pure/90 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Join the waitlist and be the first to experience AI-powered analytics across your social platforms. 
            Transform your strategy with unified insights that drive real results.
          </motion.p>

          {/* Enhanced CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <button
              onClick={onJoinWaitlist}
              className="group relative px-8 py-4 bg-brand-pure hover:bg-brand-frost text-brand-electric font-semibold rounded-xl shadow-brand-xl hover:shadow-neon-glow transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-brand-pure focus:ring-offset-2 focus:ring-offset-brand-electric flex items-center justify-center gap-2 overflow-hidden"
            >
              {/* Enhanced shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-electric/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 animate-shimmer"></div>
              
              <span className="relative">Join the Waitlist</span>
              <ArrowRight size={20} className="relative group-hover:translate-x-1 transition-transform duration-200" />
            </button>

            {/* <button className="group px-8 py-4 bg-brand-pure/20 hover:bg-brand-pure/30 backdrop-blur-sm text-brand-pure border border-brand-pure/30 hover:border-brand-pure/50 font-semibold rounded-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-brand-pure focus:ring-offset-2 focus:ring-offset-brand-electric flex items-center justify-center gap-2">
              <Sparkles size={20} className="group-hover:rotate-12 transition-transform duration-200" />
              <span>Learn More</span>
            </button> */}
          </motion.div>
        </motion.div>
      </div>

      {/* Enhanced bottom wave effect */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-16">
          <path d="M0,60 C300,90 900,30 1200,60 L1200,120 L0,120 Z" 
                fill={theme === 'dark' ? 'rgba(10, 10, 10, 0.3)' : 'rgba(255, 255, 255, 0.2)'} 
                className="transition-all duration-300"/>
        </svg>
      </div>
    </section>
  );
};

export default CTA;