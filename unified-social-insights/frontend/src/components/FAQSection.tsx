import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'What is Unified Social Insights (USI)?',
    answer:
      'USI is an all-in-one platform for social analytics, helping creators, businesses, and agencies track performance and gain AI-powered insights.',
  },
  {
    question: 'Who is USI for?',
    answer:
      'It’s built for everyone — from curious individuals to professional marketers, creators, and social media managers.',
  },
  {
    question: 'Do I need a business account to use USI?',
    answer:
      'Yes, to unlock full analytics and insights, you need to connect a Facebook Page with an Instagram Business or Creator account.',
  },
  {
    question: 'What’s included in the free plan?',
    answer:
      'Basic analytics for one account, monthly performance summaries, and limited insights. Upgrade anytime for more features.',
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 py-24 border-t border-gray-100 dark:border-gray-800">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 dark:text-white mb-10">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
            >
              <button
                onClick={() => toggle(index)}
                className="w-full flex justify-between items-center text-left text-gray-900 dark:text-white font-medium"
              >
                {faq.question}
                <ChevronDown
                  className={`transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-sm text-gray-600 dark:text-gray-400 mt-3"
                  >
                    {faq.answer}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
