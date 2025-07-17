import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Star, Sparkles, Zap, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for getting started with social insights.',
    features: [
      '1 Instagram account',
      'Basic analytics dashboard',
      'Monthly reports',
      'Community support',
      '7-day data retention'
    ],
    role: 'free',
    isPopular: false,
    icon: Sparkles,
    gradient: 'from-brand-zinc to-brand-carbon',
    glowColor: 'zinc',
    maxAccounts: '1',
    support: 'Community',
  },
  {
    name: 'Pro',
    price: '$19',
    period: 'per month',
    description: 'For content creators & marketers who want deeper insights.',
    features: [
      '3 Instagram accounts',
      'AI-powered insights & recommendations',
      'Export beautiful PDF reports',
      '30-day analytics history',
      'Email support',
      'Competitor analysis',
      'Hashtag performance tracking'
    ],
    role: 'pro',
    isPopular: true,
    icon: Zap,
    gradient: 'from-brand-electric to-brand-neon',
    glowColor: 'electric',
    maxAccounts: '3',
    support: 'Email',
  },
  {
    name: 'Business',
    price: '$49',
    period: 'per month',
    description: 'For growing teams & agencies managing multiple brands.',
    features: [
      '10 Instagram accounts',
      'Team collaboration tools',
      'Priority support',
      '90-day analytics history',
      'Custom branded reports',
      'Advanced audience insights',
      'Content scheduling integration',
      'ROI tracking & attribution'
    ],
    role: 'business',
    isPopular: false,
    icon: Star,
    gradient: 'from-brand-violet to-brand-pink',
    glowColor: 'violet',
    maxAccounts: '10',
    support: 'Priority',
  },
  {
    name: 'Agency',
    price: '$99',
    period: 'per month',
    description: 'For agencies managing multiple clients at scale.',
    features: [
      'Unlimited Instagram accounts',
      'Advanced team management',
      'White-label reports & dashboard',
      'Full analytics history',
      'Dedicated account manager',
      'API access & integrations',
      'Custom data exports',
      'Multi-client billing',
      'Advanced security features'
    ],
    role: 'agency',
    isPopular: false,
    icon: Crown,
    gradient: 'from-brand-lime to-brand-amber',
    glowColor: 'lime',
    maxAccounts: '∞',
    support: 'Dedicated',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 30,
    scale: 0.95,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-brand-pure via-brand-frost to-brand-pure dark:from-brand-void dark:via-brand-carbon dark:to-brand-void overflow-hidden transition-colors duration-500">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-electric/5 dark:bg-brand-electric/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-neon/5 dark:bg-brand-neon/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-128 h-128 bg-gradient-radial from-brand-violet/2 dark:from-brand-violet/5 to-transparent rounded-full animate-float"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-frost/80 dark:bg-glass-white backdrop-blur-sm border border-brand-zinc/20 dark:border-brand-zinc/30 mb-6"
          >
            <Sparkles className="w-4 h-4 text-brand-neon" />
            <span className="text-sm font-medium text-brand-carbon dark:text-brand-frost">Simple, Transparent Pricing</span>
            <Sparkles className="w-4 h-4 text-brand-electric" />
          </motion.div>
          
          <h2 className="text-6xl font-bold bg-gradient-to-r from-brand-carbon via-brand-electric to-brand-neon dark:from-brand-frost dark:via-brand-electric dark:to-brand-neon bg-clip-text text-transparent mb-6 font-display">
            Choose Your Growth
          </h2>
          
          <p className="text-xl text-brand-zinc dark:text-brand-frost/80 max-w-3xl mx-auto leading-relaxed">
            Unlock the power of social media insights with our premium analytics platform. 
            Scale from starter to enterprise with plans designed for every stage of growth.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8"
        >
          {plans.map((plan, index) => {
            const IconComponent = plan.icon;
            const isHovered = hoveredPlan === plan.name;
            
            return (
              <motion.div
                key={plan.name}
                variants={cardVariants}
                onHoverStart={() => setHoveredPlan(plan.name)}
                onHoverEnd={() => setHoveredPlan(null)}
                className={`group relative rounded-2xl overflow-hidden transition-all duration-500 ${
                  plan.isPopular 
                    ? 'scale-105 xl:scale-110' 
                    : 'hover:scale-105'
                } ${
                  isHovered ? 'z-20' : 'z-10'
                }`}
              >
                {/* Card Background with Glass Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-5 dark:opacity-10 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity duration-500`}></div>
                <div className="absolute inset-0 bg-brand-pure/80 dark:bg-glass-black backdrop-blur-xl border border-brand-zinc/10 dark:border-brand-zinc/20 rounded-2xl transition-colors duration-500"></div>
                
                {/* Glow Effect */}
                <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                  plan.glowColor === 'electric' ? 'shadow-electric-glow' :
                  plan.glowColor === 'violet' ? 'shadow-violet-glow' :
                  plan.glowColor === 'lime' ? 'shadow-neon-glow' :
                  'shadow-brand-lg'
                }`}></div>

                {/* Popular Badge */}
                {plan.isPopular && (
                  <motion.div
                    initial={{ scale: 0, rotate: -12 }}
                    animate={{ scale: 1, rotate: -12 }}
                    transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
                    className="absolute -top-2 -right-2 z-30"
                  >
                    <div className="bg-gradient-to-r from-brand-electric to-brand-neon px-4 py-2 rounded-lg text-xs font-bold text-white shadow-lg">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" />
                        Most Popular
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Card Content */}
                <div className="relative z-20 p-8">
                  {/* Header */}
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${plan.gradient} shadow-lg`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-brand-carbon dark:text-brand-pure font-display">
                          {plan.name}
                        </h3>
                        <p className="text-sm text-brand-zinc/70 dark:text-brand-frost/60">
                          {plan.maxAccounts} account{plan.maxAccounts !== '1' && plan.maxAccounts !== '∞' ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-brand-zinc dark:text-brand-frost/80 text-sm leading-relaxed mb-4">
                      {plan.description}
                    </p>

                    {/* Pricing */}
                    <div className="mb-6">
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-brand-carbon dark:text-brand-pure font-display">
                          {plan.price}
                        </span>
                        <span className="text-brand-zinc/80 dark:text-brand-frost/60 text-sm">
                          {plan.period}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-8">
                    <h4 className="text-sm font-semibold text-brand-zinc dark:text-brand-frost/80 mb-4 uppercase tracking-wider">
                      What's included
                    </h4>
                    <ul className="space-y-3">
                      {plan.features.map((feature, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.8 + i * 0.1 }}
                          className="flex items-start gap-3 text-sm text-brand-carbon dark:text-brand-frost/90"
                        >
                          <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                            plan.isPopular ? 'text-brand-neon' : 'text-brand-electric'
                          }`} />
                          <span>{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <motion.button
                    onClick={() => navigate(`/register?plan=${plan.role}`)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 relative overflow-hidden group/btn ${
                      plan.isPopular
                        ? 'bg-gradient-to-r from-brand-electric to-brand-neon shadow-electric-glow'
                        : 'bg-gradient-to-r from-brand-zinc to-brand-carbon dark:from-brand-carbon dark:to-brand-zinc hover:from-brand-carbon hover:to-brand-zinc dark:hover:from-brand-zinc dark:hover:to-brand-carbon'
                    }`}
                  >
                    {/* Button shimmer effect */}
                    <div className="absolute inset-0 -top-2 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                    
                    <span className="relative z-10">
                      {plan.price === '$0' ? 'Start Free' : 'Get Started'}
                    </span>
                  </motion.button>

                  {/* Support Badge */}
                  <div className="mt-4 text-center">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand-frost/20 dark:bg-brand-zinc/20 text-xs text-brand-zinc dark:text-brand-frost/60">
                      <div className={`w-2 h-2 rounded-full ${
                        plan.support === 'Dedicated' ? 'bg-brand-lime' :
                        plan.support === 'Priority' ? 'bg-brand-amber' :
                        plan.support === 'Email' ? 'bg-brand-electric' :
                        'bg-brand-zinc'
                      }`}></div>
                      {plan.support} Support
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-brand-zinc dark:text-brand-frost/60 mb-6">
            All plans include a 14-day free trial. No credit card required.
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-sm text-brand-zinc/70 dark:text-brand-frost/40">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-neon" />
              Cancel anytime
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-neon" />
              99.9% uptime guarantee
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-neon" />
              Enterprise security
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;