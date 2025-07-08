import React, { useState, Fragment, ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from '../components/ThemeToggle';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  BarChart,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { Menu as Dropdown, Transition } from '@headlessui/react';

const DashboardShell: React.FC<{ children?: ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/dashboard/overview', icon: LayoutDashboard, label: 'Overview' },
    { to: '/dashboard/insights', icon: BarChart, label: 'Insights' },
    { to: '/dashboard/select-page', icon: Settings, label: 'Select Page' },
  ];

  const renderNavLinks = () =>
    navLinks.map(({ to, icon: Icon, label }) => (
      <NavLink
        key={to}
        to={to}
        className={({ isActive }) =>
          `flex items-center gap-2 px-3 py-2 rounded transition text-sm font-medium ${
            isActive
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`
        }
        onClick={() => setIsSidebarOpen(false)}
      >
        <Icon size={18} /> {label}
      </NavLink>
    ));

  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed z-50 lg:static transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } transition-transform duration-300 ease-in-out
          w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 space-y-6 h-full`}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold tracking-tight text-blue-600 dark:text-white">
            📊 USI Dashboard
          </h2>
          <button
            className="lg:hidden text-gray-500 dark:text-gray-300"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>
        <nav className="space-y-2">{renderNavLinks()}</nav>
      </aside>

      {/* Main layout */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex items-center gap-4">
            {/* Mobile toggle */}
            <button
              className="lg:hidden text-gray-700 dark:text-gray-300"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu size={22} />
            </button>
            <ThemeToggle />
          </div>

          {/* User dropdown */}
          <div className="relative">
            <Dropdown as="div" className="relative inline-block text-left">
              <Dropdown.Button className="flex items-center gap-2 text-sm font-medium focus:outline-none">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold uppercase">
                  {user?.email?.charAt(0) || 'U'}
                </div>
              </Dropdown.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Dropdown.Items className="absolute right-0 mt-2 w-44 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                  <div className="py-1 text-sm text-gray-700 dark:text-gray-200">
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-600 truncate">
                      {user?.email}
                    </div>
                    <div className="px-4 py-1 text-xs text-indigo-500 font-semibold uppercase">
                      {user?.role || 'Free'}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </Dropdown.Items>
              </Transition>
            </Dropdown>
          </div>
        </header>

        {/* Main content */}
        <main className="p-6 flex-1 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          {children ?? <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default DashboardShell;
