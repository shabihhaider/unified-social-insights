import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { BarChart3, Brain, Zap, ArrowRight, TrendingUp, Users, Target } from 'lucide-react';

const AboutSection = () => {
  const { theme } = useTheme();

  const features = [
    {
      icon: BarChart3,
      title: 'Unified Dashboard',
      description: 'No more switching tabs. Track Instagram & Facebook in one powerful place.',
      gradient: 'from-brand-electric to-brand-neon',
      stats: '10x faster',
      visual: (
        <div className="absolute -top-2 -right-2 w-24 h-24 bg-gradient-to-br from-brand-electric/20 to-brand-neon/20 rounded-full blur-xl"></div>
      )
    },
    {
      icon: Brain,
      title: 'AI-Powered Insights',
      description: "Know exactly what's working and when to post — with smart suggestions that get better over time.",
      gradient: 'from-brand-violet to-brand-electric',
      stats: '94% accuracy',
      visual: (
        <div className="absolute -top-2 -right-2">
          <div className="w-6 h-6 bg-brand-violet rounded-full animate-pulse"></div>
          <div className="w-4 h-4 bg-brand-electric rounded-full absolute top-2 left-2 animate-pulse" style={{animationDelay: '0.5s'}}></div>
          <div className="w-3 h-3 bg-brand-neon rounded-full absolute top-3 left-3 animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
      )
    },
    {
      icon: Zap,
      title: 'Built for Scale',
      description: 'From freelancers to agencies, scale effortlessly with tools made for your growth.',
      gradient: 'from-brand-lime to-brand-electric',
      stats: '1M+ users',
      visual: (
        <div className="absolute -top-1 -right-1 flex gap-1">
          <TrendingUp size={16} className="text-brand-lime animate-bounce" />
          <Target size={14} className="text-brand-electric animate-pulse" />
        </div>
      )
    },
  ];

  // const metrics = [
  //   { value: '10K+', label: 'Active Users', icon: Users },
  //   { value: '2.5M', label: 'Posts Analyzed', icon: BarChart3 },
  //   { value: '94%', label: 'Accuracy Rate', icon: Target },
  //   { value: '50%', label: 'Time Saved', icon: Zap }
  // ];

  return (
    <section className="py-24 lg:py-32 relative overflow-hidden bg-gradient-to-br from-brand-pure via-brand-frost/10 to-brand-frost/20 dark:from-brand-void dark:via-brand-carbon/20 dark:to-brand-carbon/90">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-40 h-40 bg-brand-electric/10 dark:bg-brand-neon/8 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-1/2 right-20 w-56 h-56 bg-brand-violet/15 dark:bg-brand-electric/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 left-1/3 w-32 h-32 bg-brand-neon/20 dark:bg-brand-violet/8 rounded-full blur-2xl animate-bounce-subtle"></div>
        <div className="absolute top-1/4 left-1/2 w-24 h-24 bg-brand-lime/15 dark:bg-brand-lime/5 rounded-full blur-xl animate-float" style={{animationDelay: '1.5s'}}></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, ${theme === 'dark' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.1)'} 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-4xl mx-auto mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-brand-electric/10 to-brand-neon/10 dark:from-brand-frost/10 dark:to-brand-electric/10 backdrop-blur-sm border border-brand-electric/20 dark:border-brand-frost/20 text-brand-electric dark:text-brand-frost text-sm font-medium mb-6 shadow-brand hover:shadow-brand-lg transition-all duration-300">
            <Zap size={16} className="animate-pulse" />
            <span>Powered by AI</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-extrabold mb-6">
            <span className="text-brand-void dark:text-brand-pure">Why </span>
            <span className="bg-brand-electric bg-clip-text text-transparent animate-gradient bg-300%">
              Insightlyx
            </span>
            <span className="text-brand-void dark:text-brand-pure">?</span>
          </h2>
          <p className="text-lg md:text-xl text-brand-zinc/80 dark:text-brand-frost leading-relaxed">
            Insightlyx is your single source of truth for social performance. Whether you're growing a brand, running campaigns, or managing clients — our unified dashboard and AI-driven analytics keep you in control.
          </p>
        </motion.div>

        {/* Metrics Bar */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
        >
          {metrics.map((metric, i) => (
            <div key={i} className="text-center p-6 bg-brand-pure/80 dark:bg-brand-carbon/60 backdrop-blur-sm rounded-xl border border-brand-frost/30 dark:border-brand-zinc/30 shadow-brand hover:shadow-brand-lg transition-all duration-300 hover:scale-105">
              <metric.icon size={24} className="text-brand-electric mx-auto mb-2" />
              <div className="text-2xl font-bold text-brand-void dark:text-brand-pure mb-1">{metric.value}</div>
              <div className="text-sm text-brand-zinc dark:text-brand-frost">{metric.label}</div>
            </div>
          ))}
        </motion.div> */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-20">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group relative"
            >
              {/* Enhanced background glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-pure/80 to-brand-frost/20 dark:from-brand-carbon/40 dark:to-brand-void/60 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="relative bg-brand-pure/90 dark:bg-brand-carbon/60 backdrop-blur-sm rounded-2xl shadow-brand-lg border border-brand-frost/30 dark:border-brand-zinc/40 p-8 hover:shadow-brand-xl transition-all duration-300 hover:-translate-y-2 hover:border-brand-electric/50 dark:hover:border-brand-frost/50 overflow-hidden">
                
                {/* Visual elements */}
                {feature.visual}
                
                {/* Enhanced Icon Container */}
                <div className="relative mb-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} p-0.5 group-hover:scale-110 transition-all duration-300 shadow-brand`}>
                    <div className="w-full h-full bg-brand-pure dark:bg-brand-void rounded-2xl flex items-center justify-center">
                      <feature.icon size={28} className="text-brand-electric dark:text-brand-frost group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  </div>
                  
                  {/* Enhanced glow effect */}
                  <div className={`absolute inset-0 w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300`}></div>
                  
                  {/* Stats badge */}
                  <div className="absolute -top-2 -right-2 bg-brand-electric text-brand-pure text-xs font-bold px-2 py-1 rounded-full shadow-electric-glow opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    {feature.stats}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-brand-void dark:text-brand-pure mb-3 group-hover:text-brand-electric dark:group-hover:text-brand-frost transition-colors duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-brand-zinc/80 dark:text-brand-frost leading-relaxed group-hover:text-brand-zinc dark:group-hover:text-brand-frost/90 transition-colors duration-300">
                  {feature.description}
                </p>

                {/* Enhanced hover border effect */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-brand-electric/20 dark:group-hover:border-brand-frost/20 transition-colors duration-300"></div>
                
                {/* Bottom accent line */}
                <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${feature.gradient} rounded-b-2xl scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}></div>

                {/* Shimmer effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-electric/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 animate-shimmer opacity-0 group-hover:opacity-100"></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-4 p-6 bg-gradient-to-r from-brand-electric/10 to-brand-neon/10 dark:from-brand-carbon/60 dark:to-brand-void/60 backdrop-blur-sm rounded-2xl border border-brand-electric/20 dark:border-brand-zinc/30 shadow-brand-lg">
            <div className="text-brand-void dark:text-brand-pure font-medium">
              Ready to unify your social insights?
            </div>
            <button className="group flex items-center gap-2 px-6 py-3 bg-brand-electric hover:bg-brand-neon text-brand-pure font-semibold rounded-lg shadow-electric-glow hover:shadow-electric-glow transition-all duration-300 hover:scale-105">
              <span>Get Started</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>
        </motion.div> */}
      </div>
    </section>
  );
};

export default AboutSection;