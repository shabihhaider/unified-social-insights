import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const plans = [
  {
    name: 'Free',
    price: '$0',
    description: 'Ideal for individuals starting out.',
    features: ['1 Instagram account', 'Basic analytics', 'Monthly reports'],
    role: 'free',
    isPopular: false,
  },
  {
    name: 'Pro',
    price: '$19/mo',
    description: 'For content creators & marketers.',
    features: [
      '3 Instagram accounts',
      'AI-generated insights',
      'Export PDF reports',
      '7-day history',
    ],
    role: 'pro',
    isPopular: true,
  },
  {
    name: 'Business',
    price: '$49/mo',
    description: 'For growing teams & agencies.',
    features: [
      '10 Instagram accounts',
      'Team collaboration',
      'Priority support',
      '30-day history',
    ],
    role: 'business',
    isPopular: false,
  },
  {
    name: 'Agency',
    price: '$99/mo',
    description: 'For agencies managing multiple clients.',
    features: [
      'Unlimited accounts',
      'Team management tools',
      'White-label reports',
      'Full analytics history',
    ],
    role: 'agency',
    isPopular: false,
  },
];

const Pricing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-white dark:bg-gray-900 py-24 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-12">
            Choose the plan that fits your goals. Upgrade anytime.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-xl p-6 text-left shadow-sm transition-colors duration-300 border ${
                plan.isPopular
                  ? 'border-blue-600 shadow-lg bg-white dark:bg-gray-800'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
              }`}
            >
              {plan.isPopular && (
                <span className="inline-block px-2 py-1 text-xs font-semibold text-white bg-blue-600 rounded mb-3">
                  Most Popular
                </span>
              )}

              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {plan.name}
              </h3>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {plan.description}
              </p>

              <p className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">
                {plan.price}
              </p>

              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-center text-sm text-gray-700 dark:text-gray-300"
                  >
                    <CheckCircle2 className="text-blue-600 mr-2 w-4 h-4" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => navigate(`/register?plan=${plan.role}`)}
                className={`w-full py-2 rounded text-white font-medium transition duration-200 ${
                  plan.isPopular
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-800 hover:bg-gray-900'
                }`}
              >
                Get Started
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
