import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Malik',
    title: 'Head of Marketing, TechNova',
    quote:
      'USI changed the way we understand social engagement. The AI insights are incredibly accurate and time-saving!',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    name: 'James Khan',
    title: 'Agency Owner, SocialSprint',
    quote:
      'Managing 15+ client pages has never been this efficient. USI is the all-in-one tool we’ve been waiting for.',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    name: 'Elena Alvarez',
    title: 'Growth Strategist, Finlytics',
    quote:
      'Clean dashboard, amazing UX, and the recommendations? Spot on. I literally made changes that doubled reach.',
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
  },
];

const logos = [
  'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/slack/slack-original.svg',
  'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',
  'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/notion/notion-original.svg',
];

const Testimonials = () => {
  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-extrabold mb-4">
          What Our Users Say
        </h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-12">
          Trusted by marketing leaders, digital agencies, and growth teams across the globe.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-xl shadow-md hover:shadow-lg transition-all ring-1 ring-gray-100 dark:ring-gray-700"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
                />
                <div className="text-left">
                  <p className="text-sm font-semibold">{testimonial.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{testimonial.title}</p>
                </div>
              </div>
              <blockquote className="text-gray-700 dark:text-gray-300 text-sm relative pl-6">
                <Quote className="w-5 h-5 text-blue-500 absolute left-0 top-1" />
                {testimonial.quote}
              </blockquote>
            </motion.div>
          ))}
        </div>

        {/* 🌟 Trusted by Logo Bar */}
        <div className="text-center">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
            Trusted by teams at
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {logos.map((logo, i) => (
              <img
                key={i}
                src={logo}
                alt="Company logo"
                className="h-8 grayscale hover:grayscale-0 transition duration-300"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
