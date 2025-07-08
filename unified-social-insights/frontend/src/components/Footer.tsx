import { Facebook, Twitter, Linkedin, Mail, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
        {/* Logo & Summary */}
        <div className="col-span-1">
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold text-blue-600 mb-3"
          >
            <img src="/assets/logo.png" alt="USI Logo" className="h-8 w-8" />
            Insightlyx
          </Link>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            One unified platform to power your social insights.
          </p>

          <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400">
            <a
              href="https://www.facebook.com/shabi.haider.75098/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <Facebook className="hover:text-blue-600" size={20} />
            </a>
            <a
              href="https://www.linkedin.com/in/muhammad-shabih-haider-881a19255"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <Linkedin className="hover:text-blue-600" size={20} />
            </a>

            <a
              href="https://github.com/shabihhaider"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <Github className="hover:text-blue-600" size={20} />
            </a>

            <a
              href="mailto:shabihhaider191@gmail.com"
              aria-label="Email"
            >
              <Mail className="hover:text-blue-600" size={20} />
            </a>
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="text-gray-900 dark:text-white font-semibold mb-3">
            Product
          </h4>
          <ul className="space-y-1">
            <li>
              <Link
                to="/pricing"
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600"
              >
                Pricing
              </Link>
            </li>
            <li>
              <Link
                to="/login"
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600"
              >
                Login
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600"
              >
                Sign Up
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter Signup */}
        <div>
          <h4 className="text-gray-900 dark:text-white font-semibold mb-3">
            Newsletter
          </h4>
          <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
            Get the latest insights and updates directly in your inbox.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col sm:flex-row gap-2"
          >
            <input
              type="email"
              placeholder="Your email"
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="mt-10 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Insightlyx. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
