import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import {
  Briefcase,
  Users,
  BarChart2,
  BrainCircuit,
  FileText,
  ShieldCheck,
  RefreshCcw,
  Zap,
  Sparkles,
  TrendingUp,
  ArrowUpRight,
  CheckCircle2,
} from 'lucide-react';

const features = [
  {
    title: 'Built for Everyone',
    description:
      "Whether you're just curious or building a personal brand — access essential stats and insights for free.",
    icon: Users,
    gradient: 'from-brand-electric to-brand-neon',
    category: 'Accessibility',
    benefits: ['Free tier available', 'Easy setup', 'Instant insights'],
    popular: false
  },
  {
    title: 'Power Tools for Creators',
    description:
      'Track your growth, discover best times to post, and let AI show what content really connects.',
    icon: BrainCircuit,
    gradient: 'from-brand-violet to-brand-electric',
    category: 'Creator Tools',
    benefits: ['AI recommendations', 'Growth tracking', 'Optimal timing'],
    popular: true
  },
  {
    title: 'Smarter Business Decisions',
    description:
      'Measure brand performance, export reports, and get actionable AI recommendations for your next campaign.',
    icon: BarChart2,
    gradient: 'from-brand-neon to-brand-electric',
    category: 'Analytics',
    benefits: ['Performance metrics', 'Export reports', 'Campaign insights'],
    popular: false
  },
  {
    title: 'Agency-Ready Insights',
    description:
      'Manage multiple clients, automate reporting, and collaborate with your team — all from one platform.',
    icon: Briefcase,
    gradient: 'from-brand-electric to-brand-violet',
    category: 'Enterprise',
    benefits: ['Multi-client support', 'Team collaboration', 'White-label reports'],
    popular: false
  },
  {
    title: 'AI-Powered Insights',
    description:
      'Let AI surface weekly trends, engagement drops, and post timing recommendations to boost visibility.',
    icon: Zap,
    gradient: 'from-brand-lime to-brand-electric',
    category: 'AI Technology',
    benefits: ['Trend analysis', 'Anomaly detection', 'Smart scheduling'],
    popular: false
  },
  {
    title: 'Automated Reporting',
    description:
      'Generate shareable reports with your logo, export PDFs, and automate delivery to clients or teams.',
    icon: FileText,
    gradient: 'from-brand-amber to-brand-electric',
    category: 'Automation',
    benefits: ['Custom branding', 'PDF exports', 'Scheduled delivery'],
    popular: false
  },
  {
    title: 'Secure Account Linking',
    description:
      'Connect Instagram and Facebook pages using OAuth2 with token refresh every 6–12 hours.',
    icon: RefreshCcw,
    gradient: 'from-brand-electric to-brand-neon',
    category: 'Security',
    benefits: ['OAuth2 security', 'Auto-refresh tokens', 'Secure connections'],
    popular: false
  },
  {
    title: 'Privacy-First by Design',
    description:
      'Fully GDPR-compliant. You can export or delete your data at any time — no questions asked.',
    icon: ShieldCheck,
    gradient: 'from-brand-void to-brand-electric',
    category: 'Privacy',
    benefits: ['GDPR compliant', 'Data export', 'Full control'],
    popular: false
  },
];

const FeatureSection = () => {
  const { theme } = useTheme();

  return (
    <section className="py-24 bg-gradient-to-br from-brand-pure to-brand-frost/20 dark:from-brand-void dark:to-brand-carbon/20 border-t border-brand-frost/30 dark:border-brand-zinc/40 transition-all duration-500 relative overflow-hidden">
      {/* Enhanced background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-brand-electric/15 dark:bg-brand-neon/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-brand-violet/20 dark:bg-brand-electric/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-1/2 left-1/6 w-24 h-24 bg-brand-neon/25 dark:bg-brand-violet/8 rounded-full blur-2xl animate-bounce-subtle"></div>
        <div className="absolute bottom-1/3 right-1/3 w-36 h-36 bg-brand-lime/15 dark:bg-brand-lime/5 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Enhanced grid pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, ${theme === 'dark' ? 'rgba(6, 182, 212, 0.3)' : 'rgba(59, 130, 246, 0.2)'} 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative mb-20"
        >
          {/* Enhanced badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-brand-electric/10 to-brand-neon/10 dark:from-brand-frost/10 dark:to-brand-electric/10 backdrop-blur-sm border border-brand-electric/20 dark:border-brand-frost/20 text-brand-electric dark:text-brand-frost text-sm font-medium mb-6 shadow-brand hover:shadow-brand-lg transition-all duration-300">
            <div className="relative">
              <TrendingUp size={16} className="animate-pulse" />
              <div className="absolute inset-0 animate-ping opacity-30">
                <TrendingUp size={16} />
              </div>
            </div>
            <span>Complete Feature Suite</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-extrabold mb-6">
            <span className="bg-brand-electric bg-clip-text text-transparent animate-gradient bg-300%">
              One Platform, Every Persona
            </span>
          </h2>
          <p className="text-brand-zinc/80 dark:text-brand-frost/70 max-w-3xl mx-auto mb-4 text-lg leading-relaxed">
            From creators to agencies — Unified Social Insights scales with your goals and grows with your success.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="group relative"
              >
                {/* Popular badge */}
                {feature.popular && (
                  <div className="absolute -top-2 -right-2 z-10 bg-brand-lime text-brand-void text-xs font-bold px-3 py-1 rounded-full shadow-brand animate-pulse">
                    Popular
                  </div>
                )}

                {/* Enhanced card background with subtle gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-pure/80 to-brand-frost/20 dark:from-brand-carbon/40 dark:to-brand-void/60 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                
                <div className="relative bg-brand-pure/90 dark:bg-brand-carbon/60 backdrop-blur-sm border border-brand-frost/30 dark:border-brand-zinc/30 rounded-xl p-6 text-left shadow-brand-lg group-hover:shadow-brand-xl transition-all duration-300 group-hover:scale-[1.02] group-hover:border-brand-electric/50 dark:group-hover:border-brand-frost/50 h-full flex flex-col isolation-auto">
                  {/* Category badge */}
                  <div className="absolute top-4 right-4 px-2 py-1 text-xs font-medium text-brand-electric/70 dark:text-brand-frost/70 bg-brand-frost/20 dark:bg-brand-carbon/30 rounded-full">
                    {feature.category}
                  </div>

                  {/* Enhanced icon container with brand gradient */}
                  <div className="relative mb-6">
                    <div className={`w-14 h-14 flex items-center justify-center rounded-xl text-brand-pure bg-gradient-to-br ${feature.gradient} shadow-brand-lg group-hover:shadow-electric-glow transition-all duration-300 group-hover:scale-110 border border-brand-pure/20 relative z-10`}>
                      <Icon className="w-7 h-7 group-hover:rotate-12 transition-transform duration-300" />
                    </div>
                    
                    {/* Enhanced glow effect */}
                    <div className={`absolute inset-0 w-14 h-14 rounded-xl bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-lg pointer-events-none`}></div>
                    
                    {/* Floating sparkle effect */}
                    <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <Sparkles size={12} className="text-brand-electric dark:text-brand-frost animate-pulse" />
                    </div>
                  </div>

                  <div className="flex-grow">
                    <h3 className="text-lg font-bold text-brand-void dark:text-brand-pure mb-3 group-hover:text-brand-electric dark:group-hover:text-brand-frost transition-colors duration-300 pr-16">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-brand-zinc/80 dark:text-brand-frost/70 leading-relaxed group-hover:text-brand-zinc dark:group-hover:text-brand-frost/80 transition-colors duration-300 mb-4">
                      {feature.description}
                    </p>

                    {/* Benefits list */}
                    <div className="space-y-2 mb-4">
                      {feature.benefits.map((benefit, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-brand-zinc/70 dark:text-brand-frost/60">
                          <CheckCircle2 size={12} className="text-brand-lime flex-shrink-0" />
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Learn more link */}
                  <div className="flex items-center gap-1 text-brand-electric dark:text-brand-frost text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer select-none">
                    <span>Learn more</span>
                    <ArrowUpRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>

                  {/* Enhanced hover indicator */}
                  <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${feature.gradient} rounded-b-xl scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left pointer-events-none`}></div>
                  
                  {/* Side accent line */}
                  <div className={`absolute top-0 left-0 w-1 bg-gradient-to-b ${feature.gradient} rounded-l-xl scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top pointer-events-none`}></div>

                  {/* Shimmer effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-electric/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 opacity-0 group-hover:opacity-100 rounded-xl pointer-events-none"></div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Enhanced CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-6 p-8 bg-gradient-to-r from-brand-electric/5 to-brand-neon/5 dark:from-brand-carbon/60 dark:to-brand-void/60 backdrop-blur-sm rounded-2xl border border-brand-electric/20 dark:border-brand-zinc/30 shadow-brand-lg">
            <div className="text-center sm:text-left">
              <h3 className="text-xl font-bold text-brand-void dark:text-brand-pure mb-2">
                Ready to Transform Your Social Strategy?
              </h3>
              <p className="text-brand-zinc dark:text-brand-frost text-sm">
                Join thousands of creators and agencies already using our platform
              </p>
            </div>
            <div className="flex gap-3">
              <button className="group flex items-center gap-2 px-6 py-3 bg-brand-electric hover:bg-brand-neon text-brand-pure font-semibold rounded-lg shadow-electric-glow hover:shadow-electric-glow transition-all duration-300 hover:scale-105">
                <span>Start Free Trial</span>
                <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200" />
              </button>
              <button className="flex items-center gap-2 px-6 py-3 border border-brand-electric/30 dark:border-brand-frost/30 text-brand-electric dark:text-brand-frost font-semibold rounded-lg hover:bg-brand-electric/10 dark:hover:bg-brand-frost/10 transition-all duration-300">
                <span>View Demo</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeatureSection;