import { motion } from 'framer-motion';
import {
  Briefcase,
  Users,
  BarChart2,
  BrainCircuit,
  FileText,
  ShieldCheck,
  RefreshCcw,
  Zap,
} from 'lucide-react';

const features = [
  {
    title: 'Built for Everyone',
    description:
      'Whether you’re just curious or building a personal brand — access essential stats and insights for free.',
    icon: Users,
    gradient: 'from-indigo-500 to-purple-600',
  },
  {
    title: 'Power Tools for Creators',
    description:
      'Track your growth, discover best times to post, and let AI show what content really connects.',
    icon: BrainCircuit,
    gradient: 'from-pink-500 to-red-500',
  },
  {
    title: 'Smarter Business Decisions',
    description:
      'Measure brand performance, export reports, and get actionable AI recommendations for your next campaign.',
    icon: BarChart2,
    gradient: 'from-green-500 to-teal-500',
  },
  {
    title: 'Agency-Ready Insights',
    description:
      'Manage multiple clients, automate reporting, and collaborate with your team — all from one platform.',
    icon: Briefcase,
    gradient: 'from-yellow-500 to-orange-500',
  },
  {
    title: 'AI-Powered Insights',
    description:
      'Let AI surface weekly trends, engagement drops, and post timing recommendations to boost visibility.',
    icon: Zap,
    gradient: 'from-fuchsia-500 to-pink-500',
  },
  {
    title: 'Automated Reporting',
    description:
      'Generate shareable reports with your logo, export PDFs, and automate delivery to clients or teams.',
    icon: FileText,
    gradient: 'from-blue-600 to-cyan-600',
  },
  {
    title: 'Secure Account Linking',
    description:
      'Connect Instagram and Facebook pages using OAuth2 with token refresh every 6–12 hours.',
    icon: RefreshCcw,
    gradient: 'from-emerald-500 to-lime-500',
  },
  {
    title: 'Privacy-First by Design',
    description:
      'Fully GDPR-compliant. You can export or delete your data at any time — no questions asked.',
    icon: ShieldCheck,
    gradient: 'from-gray-700 to-gray-900',
  },
];

const FeatureSection = () => {
  return (
    <section className="py-24 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
            One Platform, Every Persona
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto mb-12">
            From creators to agencies — Unified Social Insights scales with your goals and grows with your success.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 text-left shadow hover:shadow-md transition-all"
              >
                <div
                  className={`w-12 h-12 flex items-center justify-center rounded-full text-white bg-gradient-to-br ${feature.gradient} mb-4`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
