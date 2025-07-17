import React, { useState, Fragment, ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from '../components/ThemeToggle';
import { NavLink, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Sparkles,
  BrainCircuit,
  FileText,
  Shield,
  Zap,
  TrendingUp,
  Instagram,
  Facebook,
  Bell,
  Search,
  Crown,
  Star,
  Gift
} from 'lucide-react';
import { Menu as Dropdown, Transition } from '@headlessui/react';

const DashboardShell: React.FC<{ children?: ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navSections = [
    {
      title: 'Analytics',
      items: [
        { 
          to: '/dashboard/overview', 
          icon: LayoutDashboard, 
          label: 'Overview',
          description: 'Quick insights snapshot'
        },
        { 
          to: '/dashboard/insights', 
          icon: BrainCircuit, 
          label: 'AI Insights',
          description: 'AI-powered recommendations',
          isNew: true
        },
        { 
          to: '/dashboard/analytics', 
          icon: BarChart3, 
          label: 'Analytics',
          description: 'Detailed performance metrics'
        },
        { 
          to: '/dashboard/reports', 
          icon: FileText, 
          label: 'Reports',
          description: 'Export & share reports'
        }
      ]
    },
    {
      title: 'Management',
      items: [
        { 
          to: '/dashboard/accounts', 
          icon: Users, 
          label: 'Social Accounts',
          description: 'Manage connected accounts'
        },
        { 
          to: '/dashboard/settings', 
          icon: Settings, 
          label: 'Settings',
          description: 'Account & preferences'
        }
      ]
    }
  ];

  const planInfo = {
    free: { icon: Gift, name: 'Free', color: 'text-brand-lime' },
    pro: { icon: Star, name: 'Pro', color: 'text-brand-electric' },
    business: { icon: Crown, name: 'Business', color: 'text-brand-violet' },
    agency: { icon: Crown, name: 'Agency', color: 'text-brand-violet' }
  };

  const currentPlan = planInfo[user?.role as keyof typeof planInfo] || planInfo.free;

  const renderNavItem = (item: any, sectionTitle: string) => {
    const isActive = location.pathname === item.to;
    
    return (
      <NavLink
        key={item.to}
        to={item.to}
        className={`group relative block p-3 rounded-xl transition-all duration-300 ${
          isActive
            ? 'bg-brand-electric text-brand-pure shadow-electric-glow'
            : 'text-brand-zinc dark:text-brand-frost hover:bg-brand-frost/10 dark:hover:bg-brand-carbon/30 hover:text-brand-electric dark:hover:text-brand-frost'
        }`}
        onClick={() => setIsSidebarOpen(false)}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg transition-all duration-300 ${
            isActive 
              ? 'bg-brand-pure/20' 
              : 'bg-brand-frost/20 dark:bg-brand-carbon/40 group-hover:bg-brand-electric/10'
          }`}>
            <item.icon size={18} className={isActive ? 'text-brand-pure' : 'text-brand-electric'} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">{item.label}</span>
              {item.isNew && (
                <span className="px-2 py-0.5 bg-brand-lime text-brand-void text-xs font-bold rounded-full">
                  NEW
                </span>
              )}
            </div>
            <p className={`text-xs mt-0.5 ${
              isActive 
                ? 'text-brand-pure/80' 
                : 'text-brand-zinc/60 dark:text-brand-frost/60'
            }`}>
              {item.description}
            </p>
          </div>
        </div>
        
        {/* Active indicator */}
        {isActive && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-brand-pure rounded-l-full"></div>
        )}
      </NavLink>
    );
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-brand-pure to-brand-frost/20 dark:from-brand-void dark:to-brand-carbon/20 transition-colors duration-300">
      {/* Mobile overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-brand-void/40 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: window.innerWidth >= 1024 ? 0 : (isSidebarOpen ? 0 : '-100%')
        }}
        className="fixed z-50 lg:static w-80 bg-brand-pure/95 dark:bg-brand-carbon/95 backdrop-blur-xl border-r border-brand-frost/30 dark:border-brand-zinc/40 h-full shadow-brand-xl lg:shadow-none"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-brand-frost/30 dark:border-brand-zinc/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-electric rounded-xl flex items-center justify-center shadow-electric-glow animate-glow">
                <Sparkles className="text-brand-pure w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold bg-brand-electric bg-clip-text text-transparent">
                  Insightlyx
                </h2>
                <p className="text-xs text-brand-zinc dark:text-brand-frost">Dashboard</p>
              </div>
            </div>
            <button
              className="lg:hidden p-2 text-brand-zinc dark:text-brand-frost hover:text-brand-electric transition-colors duration-200"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          {/* User Plan */}
          <div className="p-4 mx-4 mt-4 bg-gradient-to-r from-brand-electric/10 to-brand-neon/10 dark:from-brand-carbon/60 dark:to-brand-zinc/40 rounded-xl border border-brand-electric/20 dark:border-brand-zinc/30">
            <div className="flex items-center gap-3">
              <currentPlan.icon size={16} className={currentPlan.color} />
              <div className="flex-1">
                <div className="text-sm font-medium text-brand-void dark:text-brand-pure">
                  {currentPlan.name} Plan
                </div>
                <div className="text-xs text-brand-zinc dark:text-brand-frost">
                  {user?.email}
                </div>
              </div>
              {user?.role === 'free' && (
                <button
                  onClick={() => navigate('/pricing')}
                  className="px-3 py-1 bg-brand-electric text-brand-pure text-xs font-medium rounded-lg hover:bg-brand-neon transition-colors duration-200"
                >
                  Upgrade
                </button>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
            {navSections.map((section) => (
              <div key={section.title}>
                <h3 className="text-xs font-semibold text-brand-zinc/60 dark:text-brand-frost/60 uppercase tracking-wider mb-3 px-3">
                  {section.title}
                </h3>
                <div className="space-y-1">
                  {section.items.map((item) => renderNavItem(item, section.title))}
                </div>
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-brand-frost/30 dark:border-brand-zinc/40">
            <div className="flex items-center gap-3 p-3 bg-brand-frost/10 dark:bg-brand-carbon/30 rounded-lg">
              <Shield size={16} className="text-brand-electric" />
              <div className="flex-1">
                <div className="text-xs font-medium text-brand-void dark:text-brand-pure">
                  GDPR Compliant
                </div>
                <div className="text-xs text-brand-zinc dark:text-brand-frost">
                  Your data is secure
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main layout */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="flex items-center justify-between p-4 lg:p-6 border-b border-brand-frost/30 dark:border-brand-zinc/40 bg-brand-pure/95 dark:bg-brand-carbon/95 backdrop-blur-xl sticky top-0 z-40 shadow-sm">
          <div className="flex items-center gap-4">
            {/* Mobile toggle */}
            <button
              className="lg:hidden p-2 text-brand-zinc dark:text-brand-frost hover:text-brand-electric transition-colors duration-200 rounded-lg hover:bg-brand-frost/10 dark:hover:bg-brand-carbon/30"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu size={20} />
            </button>

            {/* Search */}
            <div className="hidden md:flex relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-brand-zinc/60 dark:text-brand-frost/60" />
              </div>
              <input
                type="text"
                placeholder="Search insights..."
                className="pl-10 pr-4 py-2 w-64 bg-brand-pure dark:bg-brand-void border border-brand-frost/30 dark:border-brand-zinc/40 rounded-lg text-sm text-brand-void dark:text-brand-pure placeholder-brand-zinc/60 dark:placeholder-brand-frost/60 focus:outline-none focus:ring-2 focus:ring-brand-electric focus:border-transparent transition-all duration-300"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            
            {/* Notifications */}
            <button className="relative p-2 text-brand-zinc dark:text-brand-frost hover:text-brand-electric transition-colors duration-200 rounded-lg hover:bg-brand-frost/10 dark:hover:bg-brand-carbon/30">
              <Bell size={20} />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-electric text-brand-pure text-xs font-bold rounded-full flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>

            {/* User dropdown */}
            <Dropdown as="div" className="relative">
              <Dropdown.Button className="flex items-center gap-2 p-2 rounded-lg hover:bg-brand-frost/10 dark:hover:bg-brand-carbon/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-electric/20">
                <div className="w-8 h-8 bg-brand-electric text-brand-pure rounded-lg flex items-center justify-center font-semibold uppercase text-sm shadow-electric-glow">
                  {user?.email?.charAt(0) || 'U'}
                </div>
              </Dropdown.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-150"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Dropdown.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-brand-pure/98 dark:bg-brand-carbon/98 backdrop-blur-xl border border-brand-frost/30 dark:border-brand-zinc/40 rounded-xl shadow-brand-xl focus:outline-none z-[60]">
                  <div className="py-2">
                    <div className="px-4 py-3 border-b border-brand-frost/20 dark:border-brand-zinc/30">
                      <p className="text-xs text-brand-zinc dark:text-brand-frost">Signed in as</p>
                      <p className="text-sm font-semibold text-brand-void dark:text-brand-pure truncate mt-1">
                        {user?.email}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <currentPlan.icon size={12} className={currentPlan.color} />
                        <span className="text-xs text-brand-zinc dark:text-brand-frost">
                          {currentPlan.name} Plan
                        </span>
                      </div>
                    </div>
                    <Dropdown.Item>
                      {({ active }) => (
                        <button
                          onClick={() => navigate('/dashboard/settings')}
                          className={`w-full px-4 py-2 text-left flex items-center gap-2 transition-colors duration-200 ${
                            active 
                              ? 'bg-brand-frost/10 dark:bg-brand-carbon/30 text-brand-electric dark:text-brand-frost' 
                              : 'text-brand-zinc dark:text-brand-frost'
                          }`}
                        >
                          <Settings size={16} />
                          Settings
                        </button>
                      )}
                    </Dropdown.Item>
                    <Dropdown.Item>
                      {({ active }) => (
                        <button
                          onClick={handleLogout}
                          className={`w-full px-4 py-2 text-left flex items-center gap-2 transition-colors duration-200 ${
                            active 
                              ? 'bg-error-50 dark:bg-error-900/20 text-error-600 dark:text-error-400' 
                              : 'text-brand-zinc dark:text-brand-frost hover:text-error-600 dark:hover:text-error-400'
                          }`}
                        >
                          <LogOut size={16} />
                          Sign out
                        </button>
                      )}
                    </Dropdown.Item>
                  </div>
                </Dropdown.Items>
              </Transition>
            </Dropdown>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          {children ?? <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default DashboardShell;