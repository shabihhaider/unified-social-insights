import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, Sparkles, MessageSquare, Shield, Zap, Users } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const faqs = [
  {
    question: 'What is Unified Social Insights (USI)?',
    answer:
      'USI is an all-in-one platform for social analytics, helping creators, businesses, and agencies track performance and gain AI-powered insights across Instagram and Facebook with unified dashboard.',
    icon: Sparkles,
    category: 'General'
  },
  {
    question: 'Who is USI designed for?',
    answer:
      "It's built for everyone — from curious individuals and content creators to professional marketers, agencies, and social media managers looking to optimize their social presence.",
    icon: Users,
    category: 'Target Audience'
  },
  {
    question: 'Do I need a business account to use USI?',
    answer:
      'Yes, to unlock full analytics and insights, you need to connect a Facebook Page with an Instagram Business or Creator account. This ensures access to comprehensive metrics and data.',
    icon: Shield,
    category: 'Requirements'
  },
  {
    question: "What's included in the free plan?",
    answer:
      'Basic analytics for one account, monthly performance summaries, essential insights, and limited AI recommendations. Upgrade anytime for advanced features, multiple accounts, and detailed reporting.',
    icon: Zap,
    category: 'Pricing'
  },
  {
    question: 'How secure is my social media data?',
    answer:
      'We use OAuth2 authentication and refresh tokens every 6-12 hours. Your data is encrypted, GDPR-compliant, and you can export or delete it anytime. We never store passwords.',
    icon: Shield,
    category: 'Security'
  },
  {
    question: 'Can I manage multiple social accounts?',
    answer:
      'Yes! Our Pro and Agency plans support multiple Instagram and Facebook accounts. Perfect for agencies managing client accounts or individuals with multiple brands.',
    icon: Users,
    category: 'Features'
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { theme } = useTheme();

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative py-24 bg-gradient-to-br from-brand-frost/10 via-brand-pure to-brand-electric/5 dark:from-brand-void dark:via-brand-carbon/80 dark:to-brand-void/90 border-t border-brand-frost/20 dark:border-brand-zinc/40 overflow-hidden">
      {/* Enhanced background decorative elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/6 w-64 h-64 bg-brand-electric/10 dark:bg-brand-neon/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-brand-violet/10 dark:bg-brand-electric/5 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-neon/5 dark:bg-brand-violet/3 rounded-full blur-3xl animate-bounce-subtle"></div>
        <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-brand-lime/10 dark:bg-brand-lime/3 rounded-full blur-xl animate-float" style={{animationDelay: '1.5s'}}></div>
      </div>

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, ${theme === 'dark' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.15)'} 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-electric rounded-2xl shadow-electric-glow mb-6 animate-glow">
            <HelpCircle className="w-8 h-8 text-brand-pure" />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-extrabold bg-brand-electric bg-clip-text text-transparent mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-brand-zinc/80 dark:text-brand-frost/70 max-w-2xl mx-auto text-lg leading-relaxed">
            Everything you need to know about Unified Social Insights. Can't find what you're looking for? 
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const Icon = faq.icon;
            const isOpen = openIndex === index;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="group relative"
              >
                {/* Background glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-brand-electric/10 to-brand-neon/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm pointer-events-none"></div>
                
                <div className={`relative bg-brand-pure/90 dark:bg-brand-carbon/60 backdrop-blur-sm border rounded-xl transition-all duration-300 ${
                  isOpen 
                    ? 'border-brand-electric/50 dark:border-brand-frost/40 shadow-brand-lg shadow-brand-electric/10 dark:shadow-brand-frost/5' 
                    : 'border-brand-frost/30 dark:border-brand-zinc/30 hover:border-brand-electric/40 dark:hover:border-brand-frost/30'
                } hover:shadow-brand-xl`}>
                  
                  {/* Category badge */}
                  <div className="absolute top-4 right-4 px-2 py-1 text-xs font-medium text-brand-electric/70 dark:text-brand-frost/70 bg-brand-frost/20 dark:bg-brand-carbon/30 rounded-full">
                    {faq.category}
                  </div>

                  <button
                    onClick={() => toggle(index)}
                    className="w-full flex items-center justify-between text-left p-6 focus:outline-none focus:ring-2 focus:ring-brand-electric focus:ring-offset-2 dark:focus:ring-offset-brand-void rounded-xl transition-all duration-300"
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${index}`}
                  >
                    <div className="flex items-center space-x-4 flex-1 pr-8">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300 ${
                        isOpen 
                          ? 'bg-brand-electric shadow-electric-glow scale-110' 
                          : 'bg-brand-frost/20 dark:bg-brand-zinc/20 group-hover:bg-brand-electric/20 dark:group-hover:bg-brand-frost/20'
                      }`}>
                        <Icon className={`w-5 h-5 transition-all duration-300 ${
                          isOpen 
                            ? 'text-brand-pure' 
                            : 'text-brand-electric dark:text-brand-frost group-hover:scale-110'
                        }`} />
                      </div>
                      
                      <span className={`font-semibold text-lg transition-colors duration-300 ${
                        isOpen 
                          ? 'text-brand-electric dark:text-brand-frost' 
                          : 'text-brand-void dark:text-brand-pure group-hover:text-brand-electric dark:group-hover:text-brand-frost'
                      }`}>
                        {faq.question}
                      </span>
                    </div>

                    <ChevronDown
                      className={`w-5 h-5 transition-all duration-300 flex-shrink-0 ${
                        isOpen 
                          ? 'rotate-180 text-brand-electric dark:text-brand-frost' 
                          : 'text-brand-zinc dark:text-brand-frost/70 group-hover:text-brand-electric dark:group-hover:text-brand-frost'
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        id={`faq-answer-${index}`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6">
                          <div className="border-t border-brand-frost/20 dark:border-brand-zinc/20 pt-4">
                            <p className="text-brand-zinc/80 dark:text-brand-frost/80 leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Bottom accent line */}
                  <div className={`absolute bottom-0 left-0 h-0.5 bg-brand-electric rounded-b-xl transition-all duration-300 pointer-events-none ${
                    isOpen ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></div>
                  
                  {/* Shimmer effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-electric/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 opacity-0 group-hover:opacity-100 rounded-xl pointer-events-none"></div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Enhanced Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-brand-electric/5 to-brand-neon/5 dark:from-brand-carbon/40 dark:to-brand-zinc/20 backdrop-blur-sm rounded-2xl p-8 border border-brand-frost/20 dark:border-brand-zinc/20 shadow-brand-lg">
            <div className="flex items-center justify-center w-12 h-12 bg-brand-electric rounded-xl shadow-electric-glow mx-auto mb-4">
              <MessageSquare className="w-6 h-6 text-brand-pure" />
            </div>
            <h3 className="text-xl font-semibold text-brand-void dark:text-brand-pure mb-2">
              Still have questions?
            </h3>
            <p className="text-brand-zinc/80 dark:text-brand-frost/70 mb-6 max-w-md mx-auto">
              Our support team is here to help you get the most out of USI. Get answers in under 2 minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button className="inline-flex items-center px-6 py-3 bg-brand-electric hover:bg-brand-neon text-brand-pure font-medium rounded-lg shadow-electric-glow hover:shadow-electric-glow transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-brand-electric focus:ring-offset-2 dark:focus:ring-offset-brand-void">
                Contact Support
              </button>
              <button className="inline-flex items-center px-6 py-3 border border-brand-electric/30 dark:border-brand-frost/30 text-brand-electric dark:text-brand-frost font-medium rounded-lg hover:bg-brand-electric/10 dark:hover:bg-brand-frost/10 transition-all duration-300">
                Browse Help Center
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;