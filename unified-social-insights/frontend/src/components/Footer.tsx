import { Facebook, Twitter, Linkedin, Mail, Github, Send, Sparkles, ArrowRight, Heart, Shield, Zap, Users, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { theme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setEmail('');
    setIsSubmitting(false);
  };

  const socialLinks = [
    { 
      href: "https://www.facebook.com/shabi.haider.75098/", 
      icon: Facebook, 
      label: "Facebook",
      color: "hover:text-blue-500 dark:hover:text-blue-400",
      gradient: "from-blue-600 to-blue-500"
    },
    { 
      href: "https://www.linkedin.com/in/muhammad-shabih-haider-881a19255", 
      icon: Linkedin, 
      label: "LinkedIn",
      color: "hover:text-blue-600 dark:hover:text-blue-400",
      gradient: "from-blue-700 to-blue-600"
    },
    { 
      href: "https://github.com/shabihhaider", 
      icon: Github, 
      label: "GitHub",
      color: "hover:text-gray-800 dark:hover:text-white",
      gradient: "from-gray-700 to-gray-600"
    },
    { 
      href: "mailto:shabihhaider191@gmail.com", 
      icon: Mail, 
      label: "Email",
      color: "hover:text-brand-electric dark:hover:text-brand-frost",
      gradient: "from-brand-electric to-brand-neon"
    }
  ];

  const productLinks = [
    { to: '/features', label: 'Features', new: false },
    { to: '/pricing', label: 'Pricing', new: false },
    { to: '/integrations', label: 'Integrations', new: true },
    { to: '/api', label: 'API Docs', new: false }
  ];

  const companyLinks = [
    { to: '/about', label: 'About Us' },
    { to: '/careers', label: 'Careers' },
    { to: '/contact', label: 'Contact' },
    { to: '/blog', label: 'Blog' }
  ];

  const legalLinks = [
    { to: '/privacy', label: 'Privacy Policy' },
    { to: '/terms', label: 'Terms of Service' },
    { to: '/security', label: 'Security' },
    { to: '/gdpr', label: 'GDPR' }
  ];

  const trustIndicators = [
    { icon: Shield, text: 'GDPR Compliant', color: 'text-brand-lime' },
    { icon: Zap, text: '99.9% Uptime', color: 'text-brand-electric' },
    { icon: Users, text: '10K+ Users', color: 'text-brand-violet' },
    { icon: Award, text: 'SOC 2 Certified', color: 'text-brand-neon' }
  ];

  return (
    <footer className="relative bg-gradient-to-b from-brand-pure to-brand-frost/20 dark:from-brand-void dark:to-brand-carbon/20 border-t border-brand-frost/30 dark:border-brand-zinc/40 pt-20 pb-8 overflow-hidden">
      {/* Enhanced background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-1/4 w-32 h-32 bg-brand-electric/10 dark:bg-brand-neon/8 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-10 right-1/4 w-40 h-40 bg-brand-violet/15 dark:bg-brand-electric/5 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-1/2 left-1/6 w-24 h-24 bg-brand-neon/20 dark:bg-brand-violet/5 rounded-full blur-2xl animate-bounce-subtle"></div>
        <div className="absolute bottom-1/3 right-1/3 w-28 h-28 bg-brand-lime/15 dark:bg-brand-lime/3 rounded-full blur-xl animate-float" style={{animationDelay: '1.5s'}}></div>
      </div>

      {/* Enhanced grid pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, ${theme === 'dark' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)'} 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Enhanced Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <Link
              to="/"
              className="flex items-center gap-3 text-xl font-bold transition-all duration-300 mb-6 group"
            >
              <div className="relative">
                <div className="w-10 h-10 bg-brand-electric rounded-xl flex items-center justify-center shadow-electric-glow transition-all duration-300 group-hover:shadow-electric-glow group-hover:scale-110 animate-glow">
                  <Sparkles className="text-brand-pure w-5 h-5" />
                </div>
                <div className="absolute inset-0 bg-brand-electric/20 rounded-xl scale-0 group-hover:scale-150 transition-transform duration-300 blur-md pointer-events-none"></div>
              </div>
              <span className="bg-brand-electric bg-clip-text text-transparent font-extrabold tracking-tight">
                Insightlyx
              </span>
            </Link>
            
            <p className="text-brand-zinc/80 dark:text-brand-frost mb-8 max-w-md leading-relaxed text-lg">
              One unified platform to power your social insights. Transform your social media analytics with AI-driven intelligence and seamless integration.
            </p>

            {/* Enhanced social links */}
            <div className="flex items-center gap-3 mb-6">
              {socialLinks.map(({ href, icon: Icon, label, color, gradient }) => (
                <motion.a
                  key={label}
                  href={href}
                  target={href.includes('mailto') ? '_self' : '_blank'}
                  rel={href.includes('mailto') ? '' : 'noopener noreferrer'}
                  aria-label={label}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative p-3 text-brand-zinc/70 dark:text-brand-frost transition-all duration-300 rounded-xl hover:bg-brand-frost/10 dark:hover:bg-brand-carbon/20 hover:shadow-brand"
                >
                  <Icon size={20} className={`relative z-10 ${color} transition-colors duration-300`} />
                  {/* Hover background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300 pointer-events-none`}></div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Enhanced Product Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="text-brand-void dark:text-brand-pure font-bold mb-6 text-sm uppercase tracking-wider flex items-center gap-2">
              <div className="w-1 h-4 bg-brand-electric rounded-full"></div>
              Product
            </h4>
            <ul className="space-y-4">
              {productLinks.map(({ to, label, new: isNew }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-brand-zinc/80 dark:text-brand-frost hover:text-brand-electric dark:hover:text-brand-pure transition-all duration-300 inline-flex items-center group text-sm font-medium"
                  >
                    <ArrowRight size={14} className="mr-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      {label}
                    </span>
                    {isNew && (
                      <span className="ml-2 px-2 py-0.5 bg-brand-lime text-brand-void text-xs font-bold rounded-full">
                        NEW
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            viewport={{ once: true }}
          >
            <h4 className="text-brand-void dark:text-brand-pure font-bold mb-6 text-sm uppercase tracking-wider flex items-center gap-2">
              <div className="w-1 h-4 bg-brand-violet rounded-full"></div>
              Company
            </h4>
            <ul className="space-y-4">
              {companyLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-brand-zinc/80 dark:text-brand-frost hover:text-brand-electric dark:hover:text-brand-pure transition-all duration-300 inline-flex items-center group text-sm font-medium"
                  >
                    <ArrowRight size={14} className="mr-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      {label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Enhanced Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-brand-void dark:text-brand-pure font-bold mb-6 text-sm uppercase tracking-wider flex items-center gap-2">
              <div className="w-1 h-4 bg-brand-neon rounded-full"></div>
              Stay Updated
            </h4>
            <p className="text-brand-zinc/80 dark:text-brand-frost mb-6 text-sm leading-relaxed">
              Get the latest insights and updates delivered to your inbox. Join our community of social media professionals.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-brand-frost/30 dark:border-brand-zinc/50 bg-brand-pure/90 dark:bg-brand-void/90 backdrop-blur-sm text-brand-void dark:text-brand-pure placeholder-brand-zinc/60 dark:placeholder-brand-frost focus:outline-none focus:ring-2 focus:ring-brand-electric focus:border-transparent transition-all duration-300 hover:border-brand-electric/50 dark:hover:border-brand-frost/40"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Mail size={16} className="text-brand-zinc/60 dark:text-brand-frost group-focus-within:text-brand-electric dark:group-focus-within:text-brand-frost transition-colors duration-300" />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full px-4 py-3 bg-brand-electric hover:bg-brand-neon text-brand-pure rounded-xl font-medium shadow-brand-lg hover:shadow-electric-glow hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-electric focus:ring-offset-2 dark:focus:ring-offset-brand-void disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 overflow-hidden"
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-pure/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none"></div>
                
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-brand-pure/30 border-t-brand-pure rounded-full animate-spin" />
                    <span className="relative">Subscribing...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} className="relative" />
                    <span className="relative">Subscribe</span>
                  </>
                )}
              </button>
            </form>

            {/* Enhanced trust badge */}
            {/* <div className="mt-4 p-3 bg-brand-frost/10 dark:bg-brand-carbon/30 rounded-lg">
              <div className="flex items-center gap-2 text-xs text-brand-zinc/80 dark:text-brand-frost mb-1">
                <div className="w-2 h-2 bg-brand-lime rounded-full animate-pulse"></div>
                <span className="font-medium">12,000+ subscribers</span>
              </div>
              <div className="text-xs text-brand-zinc/60 dark:text-brand-frost/70">
                Weekly insights • No spam • Unsubscribe anytime
              </div>
            </div> */}
          </motion.div>
        </div>

        {/* Enhanced Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 pt-8 border-t border-brand-frost/30 dark:border-brand-zinc/40"
        >
          <div className="flex flex-col lg:flex-row justify-center items-center gap-6">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <p className="text-sm text-brand-zinc/70 dark:text-brand-frost">
                © {new Date().getFullYear()} Insightlyx. All rights reserved.
              </p>
              <div className="flex items-center gap-2 text-xs text-brand-zinc/60 dark:text-brand-frost">
                <span>CEO & Founder</span>
                <Heart size={12} className="text-error-500 animate-pulse" fill="currentColor" />
                <span>Muhammad Shabih Haider</span>
              </div>
            </div>
            
            {/* <div className="flex flex-wrap items-center gap-6 text-sm">
              {legalLinks.map(({ to, label }) => (
                <Link 
                  key={to}
                  to={to} 
                  className="text-brand-zinc/70 dark:text-brand-frost hover:text-brand-electric dark:hover:text-brand-pure transition-all duration-300 hover:underline decoration-brand-electric"
                >
                  {label}
                </Link>
              ))}
            </div> */}
          </div>
        </motion.div>
      </div>

      {/* Enhanced bottom gradient fade */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg viewBox="0 0 1200 80" preserveAspectRatio="none" className="relative block w-full h-6">
          <path d="M0,40 C300,60 900,20 1200,40 L1200,80 L0,80 Z" 
                fill={theme === 'dark' ? 'rgba(10, 10, 10, 0.1)' : 'rgba(244, 244, 245, 0.3)'} 
                className="transition-all duration-300"/>
        </svg>
      </div>
    </footer>
  );
};

export default Footer;