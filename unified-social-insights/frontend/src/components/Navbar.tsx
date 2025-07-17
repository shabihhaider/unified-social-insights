import React, { Fragment, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '../context/AuthContext';
import { Menu, X, LogOut, Sparkles } from 'lucide-react';
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
    <header className="bg-brand-pure/90 dark:bg-brand-void/90 backdrop-blur-md border-b border-brand-frost/30 dark:border-brand-zinc/40 sticky top-0 z-50 transition-all duration-300 shadow-brand">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Enhanced Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-3 text-xl font-bold transition-all duration-300 group"
          >
            <div className="relative">
              <div className="w-10 h-10 bg-brand-electric rounded-xl flex items-center justify-center shadow-electric-glow transition-all duration-300 group-hover:shadow-electric-glow group-hover:scale-110 animate-glow">
                <Sparkles className="text-brand-pure w-5 h-5" />
              </div>
              <div className="absolute inset-0 bg-brand-electric/20 rounded-xl scale-0 group-hover:scale-150 transition-transform duration-300 blur-md"></div>
            </div>
            <span className="bg-brand-electric bg-clip-text text-transparent font-extrabold tracking-tight text-shadow-electric">
              Insightlyx
            </span>
          </Link>

          {/* Enhanced Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              to="/" 
              className="text-brand-zinc dark:text-brand-frost hover:text-brand-electric dark:hover:text-brand-pure transition-all duration-300 font-medium relative group py-2"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-electric transition-all duration-300 group-hover:w-full rounded-full shadow-electric-glow"></span>
            </Link>
            <Link 
              to="/pricing" 
              className="text-brand-zinc dark:text-brand-frost hover:text-brand-electric dark:hover:text-brand-pure transition-all duration-300 font-medium relative group py-2"
            >
              Pricing
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-electric transition-all duration-300 group-hover:w-full rounded-full shadow-electric-glow"></span>
            </Link>

            <ThemeToggle />

            {user ? (
              <HeadlessMenu as="div" className="relative">
                <HeadlessMenu.Button className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-brand-electric focus:ring-offset-2 dark:focus:ring-offset-brand-void rounded-full p-1 transition-all duration-300 group">
                  <div className="w-10 h-10 bg-brand-electric text-brand-pure rounded-full flex items-center justify-center font-semibold uppercase shadow-electric-glow hover:shadow-electric-glow transition-all duration-300 hover:scale-105 border border-brand-frost/20">
                    {user.email?.[0] || 'U'}
                  </div>
                </HeadlessMenu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-150"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <HeadlessMenu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-brand-pure/95 dark:bg-brand-void/95 backdrop-blur-md border border-brand-frost/30 dark:border-brand-zinc/40 rounded-xl shadow-brand-xl ring-1 ring-black/5 dark:ring-white/5 focus:outline-none z-50">
                    <div className="py-2 text-sm">
                      <div className="px-4 py-3 border-b border-brand-frost/20 dark:border-brand-zinc/30 bg-gradient-to-r from-brand-frost/10 to-transparent dark:from-brand-carbon/20 dark:to-transparent">
                        <p className="text-xs text-brand-zinc dark:text-brand-frost font-medium">Signed in as</p>
                        <p className="text-sm font-semibold text-brand-void dark:text-brand-pure truncate mt-1">
                          {user.email}
                        </p>
                      </div>
                      <HeadlessMenu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleLogout}
                            className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-all duration-200 ${
                              active 
                                ? 'bg-error-50 dark:bg-error-900/20 text-error-600 dark:text-error-400' 
                                : 'text-brand-zinc dark:text-brand-frost hover:text-error-600 dark:hover:text-error-400'
                            }`}
                          >
                            <LogOut size={16} />
                            <span className="font-medium">Sign out</span>
                          </button>
                        )}
                      </HeadlessMenu.Item>
                    </div>
                  </HeadlessMenu.Items>
                </Transition>
              </HeadlessMenu>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-brand-zinc dark:text-brand-frost hover:text-brand-electric dark:hover:text-brand-pure transition-all duration-300 font-medium px-4 py-2 rounded-lg hover:bg-brand-frost/10 dark:hover:bg-brand-carbon/20"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="group relative px-6 py-2.5 bg-brand-electric hover:bg-brand-neon text-brand-pure rounded-lg font-medium shadow-electric-glow hover:shadow-electric-glow hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-electric focus:ring-offset-2 dark:focus:ring-offset-brand-void overflow-hidden"
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-pure/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 animate-shimmer"></div>
                  <span className="relative">Get Started</span>
                </Link>
              </div>
            )}
          </nav>

          {/* Enhanced Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2.5 text-brand-zinc dark:text-brand-frost hover:text-brand-electric dark:hover:text-brand-pure transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-electric focus:ring-offset-2 dark:focus:ring-offset-brand-void rounded-lg bg-brand-frost/10 dark:bg-brand-carbon/20 hover:bg-brand-frost/20 dark:hover:bg-brand-carbon/30"
            aria-label="Toggle mobile menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Enhanced Mobile Menu */}
      <Transition
        show={mobileOpen}
        enter="transition ease-out duration-300"
        enterFrom="opacity-0 translate-y-2"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-200"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-2"
      >
        <div className="md:hidden bg-brand-pure/95 dark:bg-brand-void/95 backdrop-blur-md border-t border-brand-frost/30 dark:border-brand-zinc/40 shadow-brand-lg">
          <div className="px-4 py-6 space-y-4">
            <div className="space-y-3">
              <Link 
                to="/" 
                onClick={() => setMobileOpen(false)} 
                className="block py-3 px-4 text-brand-zinc dark:text-brand-frost hover:text-brand-electric dark:hover:text-brand-pure transition-all duration-300 font-medium rounded-lg hover:bg-brand-frost/10 dark:hover:bg-brand-carbon/20"
              >
                Home
              </Link>
              <Link 
                to="/pricing" 
                onClick={() => setMobileOpen(false)} 
                className="block py-3 px-4 text-brand-zinc dark:text-brand-frost hover:text-brand-electric dark:hover:text-brand-pure transition-all duration-300 font-medium rounded-lg hover:bg-brand-frost/10 dark:hover:bg-brand-carbon/20"
              >
                Pricing
              </Link>
            </div>

            <div className="pt-4 border-t border-brand-frost/20 dark:border-brand-zinc/30">
              <div className="flex justify-center">
                <ThemeToggle />
              </div>
            </div>

            {user ? (
              <div className="pt-4 border-t border-brand-frost/20 dark:border-brand-zinc/30 space-y-4">
                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-brand-frost/10 to-transparent dark:from-brand-carbon/20 dark:to-transparent rounded-lg">
                  <div className="w-10 h-10 bg-brand-electric text-brand-pure rounded-full flex items-center justify-center font-semibold uppercase text-sm border border-brand-frost/20">
                    {user.email?.[0] || 'U'}
                  </div>
                  <div>
                    <p className="text-xs text-brand-zinc dark:text-brand-frost font-medium">Signed in as</p>
                    <p className="text-sm font-semibold text-brand-void dark:text-brand-pure truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/20 rounded-lg transition-all duration-300 font-medium"
                >
                  <LogOut size={16} />
                  <span>Sign out</span>
                </button>
              </div>
            ) : (
              <div className="pt-4 border-t border-brand-frost/20 dark:border-brand-zinc/30 space-y-3">
                <Link 
                  to="/login" 
                  onClick={() => setMobileOpen(false)} 
                  className="block py-3 px-4 text-brand-electric hover:text-brand-neon dark:hover:text-brand-pure transition-all duration-300 font-medium rounded-lg hover:bg-brand-frost/10 dark:hover:bg-brand-carbon/20"
                >
                  Sign in
                </Link>
                <Link 
                  to="/register" 
                  onClick={() => setMobileOpen(false)} 
                  className="block w-full text-center py-3 px-4 bg-brand-electric text-brand-pure rounded-lg font-medium shadow-electric-glow hover:shadow-electric-glow transition-all duration-300"
                >
                  Get Started
                </Link>
                {onJoinWaitlist && (
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      onJoinWaitlist();
                    }}
                    className="block w-full text-center py-3 px-4 text-brand-zinc hover:text-brand-electric dark:hover:text-brand-pure transition-all duration-300 rounded-lg hover:bg-brand-frost/10 dark:hover:bg-brand-carbon/20 font-medium"
                  >
                    Join Waitlist
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </Transition>
    </header>
  );
};

export default Navbar;