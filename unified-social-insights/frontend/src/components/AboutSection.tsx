import { motion } from 'framer-motion';

const AboutSection = () => {
  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
            Why Unified Social Insights?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Insightlyx is your single source of truth for social performance. Whether you're growing a brand, running campaigns, or managing clients — our unified dashboard and AI-driven analytics keep you in control.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mt-12">
          {[
            {
              title: 'Unified Dashboard',
              description: 'No more switching tabs. Track Instagram & Facebook in one powerful place.',
            },
            {
              title: 'AI-Powered Insights',
              description: 'Know exactly what’s working and when to post — with smart suggestions that get better over time.',
            },
            {
              title: 'Built for Scale',
              description: 'From freelancers to agencies, scale effortlessly with tools made for your growth.',
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
