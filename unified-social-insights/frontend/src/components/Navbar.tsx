import React, { Fragment, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '../context/AuthContext';
import { Menu, X, LogOut } from 'lucide-react';
import { Menu as HeadlessMenu, Transition } from '@headlessui/react';

interface NavbarProps {
  onJoinWaitlist?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onJoinWaitlist }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-blue-600">
          <img src="/assets/logo.png" alt="USI Logo" className="h-8 w-8" />
          Insightlyx
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 transition">
            Home
          </Link>
          <Link to="/pricing" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 transition">
            Pricing
          </Link>

          <ThemeToggle />

          {user ? (
            <HeadlessMenu as="div" className="relative">
              <HeadlessMenu.Button className="flex items-center gap-2 focus:outline-none">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold uppercase">
                  {user.email?.[0] || 'U'}
                </div>
              </HeadlessMenu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <HeadlessMenu.Items className="absolute right-0 mt-2 w-40 origin-top-right bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                  <div className="py-1 text-sm text-gray-700 dark:text-gray-200">
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                      {user.email}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                </HeadlessMenu.Items>
              </Transition>
            </HeadlessMenu>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-700 dark:text-gray-200 hover:text-blue-600"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Get Started
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-gray-700 dark:text-gray-200"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 px-4 pb-4 space-y-4 border-t dark:border-gray-700">
          <Link to="/" onClick={() => setMobileOpen(false)} className="block text-gray-700 dark:text-gray-200">
            Home
          </Link>
          <Link to="/pricing" onClick={() => setMobileOpen(false)} className="block text-gray-700 dark:text-gray-200">
            Pricing
          </Link>

          <div className="pt-2 border-t dark:border-gray-700">
            <ThemeToggle />
          </div>

          {user ? (
            <div className="pt-2 border-t dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{user.email}</p>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileOpen(false);
                }}
                className="w-full text-left px-2 py-2 text-red-600 hover:underline"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t dark:border-gray-700 flex flex-col gap-2">
              <Link to="/login" onClick={() => setMobileOpen(false)} className="text-blue-600">
                Login
              </Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} className="bg-blue-600 text-white px-4 py-2 rounded text-center">
                Get Started
              </Link>
              {onJoinWaitlist && (
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    onJoinWaitlist();
                  }}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Join Waitlist
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
