import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Download, 
  Trash2,
  Eye,
  EyeOff,
  Save,
  CheckCircle2,
  AlertTriangle,
  Crown,
  Mail,
  Phone,
  Calendar,
  Clock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const Settings = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form states
  const [profileData, setProfileData] = useState({
    name: user?.full_name || '',
    email: user?.email || '',
    phone: '',
    company: '',
    website: '',
    timezone: 'UTC-5',
    language: 'en'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailReports: true,
    weeklyDigest: true,
    engagementAlerts: false,
    followerMilestones: true,
    systemUpdates: false,
    marketingEmails: false
  });

  const [privacySettings, setPrivacySettings] = useState({
    dataRetention: '12months',
    analyticsSharing: false,
    thirdPartyIntegrations: true,
    publicProfile: false
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'data', label: 'Data & Export', icon: Download }
  ];

  const handleSave = async () => {
    // Simulate API call
    setTimeout(() => {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1000);
  };

  const handleExportData = () => {
    // Simulate data export
    alert('Data export will be sent to your email within 24 hours.');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Handle account deletion
      alert('Account deletion request submitted. You will receive a confirmation email.');
    }
  };

  const TabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-brand-void dark:text-brand-pure mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-brand-zinc dark:text-brand-frost mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-brand-frost/30 dark:border-brand-zinc/40 rounded-lg bg-brand-pure dark:bg-brand-void text-brand-void dark:text-brand-pure focus:outline-none focus:ring-2 focus:ring-brand-electric"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-zinc dark:text-brand-frost mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-brand-frost/30 dark:border-brand-zinc/40 rounded-lg bg-brand-pure dark:bg-brand-void text-brand-void dark:text-brand-pure focus:outline-none focus:ring-2 focus:ring-brand-electric"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-zinc dark:text-brand-frost mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-brand-frost/30 dark:border-brand-zinc/40 rounded-lg bg-brand-pure dark:bg-brand-void text-brand-void dark:text-brand-pure focus:outline-none focus:ring-2 focus:ring-brand-electric"
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-zinc dark:text-brand-frost mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    value={profileData.company}
                    onChange={(e) => setProfileData({...profileData, company: e.target.value})}
                    className="w-full px-4 py-3 border border-brand-frost/30 dark:border-brand-zinc/40 rounded-lg bg-brand-pure dark:bg-brand-void text-brand-void dark:text-brand-pure focus:outline-none focus:ring-2 focus:ring-brand-electric"
                    placeholder="Optional"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-brand-void dark:text-brand-pure mb-4">Preferences</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-brand-zinc dark:text-brand-frost mb-2">
                    Timezone
                  </label>
                  <select
                    value={profileData.timezone}
                    onChange={(e) => setProfileData({...profileData, timezone: e.target.value})}
                    className="w-full px-4 py-3 border border-brand-frost/30 dark:border-brand-zinc/40 rounded-lg bg-brand-pure dark:bg-brand-void text-brand-void dark:text-brand-pure focus:outline-none focus:ring-2 focus:ring-brand-electric"
                  >
                    <option value="UTC-8">Pacific Time (UTC-8)</option>
                    <option value="UTC-5">Eastern Time (UTC-5)</option>
                    <option value="UTC+0">GMT (UTC+0)</option>
                    <option value="UTC+1">Central European Time (UTC+1)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-zinc dark:text-brand-frost mb-2">
                    Language
                  </label>
                  <select
                    value={profileData.language}
                    onChange={(e) => setProfileData({...profileData, language: e.target.value})}
                    className="w-full px-4 py-3 border border-brand-frost/30 dark:border-brand-zinc/40 rounded-lg bg-brand-pure dark:bg-brand-void text-brand-void dark:text-brand-pure focus:outline-none focus:ring-2 focus:ring-brand-electric"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-brand-void dark:text-brand-pure mb-4">Email Notifications</h3>
              <div className="space-y-4">
                {Object.entries(notificationSettings).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-brand-frost/10 dark:bg-brand-carbon/30 rounded-lg">
                    <div>
                      <h4 className="font-medium text-brand-void dark:text-brand-pure">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </h4>
                      <p className="text-sm text-brand-zinc dark:text-brand-frost">
                        {key === 'emailReports' && 'Receive automated performance reports'}
                        {key === 'weeklyDigest' && 'Weekly summary of your social media activity'}
                        {key === 'engagementAlerts' && 'Notifications when engagement drops significantly'}
                        {key === 'followerMilestones' && 'Celebrate when you reach follower milestones'}
                        {key === 'systemUpdates' && 'Important system updates and maintenance notices'}
                        {key === 'marketingEmails' && 'Tips, tutorials, and promotional content'}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => setNotificationSettings({
                          ...notificationSettings,
                          [key]: e.target.checked
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-brand-frost/30 dark:bg-brand-zinc/30 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-electric/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-electric"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-brand-void dark:text-brand-pure mb-4">Privacy Settings</h3>
              <div className="space-y-4">
                <div className="p-4 bg-brand-frost/10 dark:bg-brand-carbon/30 rounded-lg">
                  <h4 className="font-medium text-brand-void dark:text-brand-pure mb-2">Data Retention</h4>
                  <p className="text-sm text-brand-zinc dark:text-brand-frost mb-3">How long should we keep your analytics data?</p>
                  <select
                    value={privacySettings.dataRetention}
                    onChange={(e) => setPrivacySettings({...privacySettings, dataRetention: e.target.value})}
                    className="w-full px-4 py-2 border border-brand-frost/30 dark:border-brand-zinc/40 rounded-lg bg-brand-pure dark:bg-brand-void text-brand-void dark:text-brand-pure focus:outline-none focus:ring-2 focus:ring-brand-electric"
                  >
                    <option value="6months">6 months</option>
                    <option value="12months">12 months</option>
                    <option value="24months">24 months</option>
                    <option value="indefinite">Indefinite</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 bg-brand-frost/10 dark:bg-brand-carbon/30 rounded-lg">
                  <div>
                    <h4 className="font-medium text-brand-void dark:text-brand-pure">Analytics Sharing</h4>
                    <p className="text-sm text-brand-zinc dark:text-brand-frost">Allow anonymous analytics to improve our service</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={privacySettings.analyticsSharing}
                      onChange={(e) => setPrivacySettings({
                        ...privacySettings,
                        analyticsSharing: e.target.checked
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-brand-frost/30 dark:bg-brand-zinc/30 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-electric/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-electric"></div>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-brand-void dark:text-brand-pure mb-4">Security</h3>
              <div className="space-y-4">
                <div className="p-4 bg-brand-frost/10 dark:bg-brand-carbon/30 rounded-lg">
                  <h4 className="font-medium text-brand-void dark:text-brand-pure mb-2">Change Password</h4>
                  <div className="space-y-3">
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="New password"
                        className="w-full px-4 py-3 pr-12 border border-brand-frost/30 dark:border-brand-zinc/40 rounded-lg bg-brand-pure dark:bg-brand-void text-brand-void dark:text-brand-pure focus:outline-none focus:ring-2 focus:ring-brand-electric"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-brand-zinc/60 dark:text-brand-frost/60"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <button className="px-4 py-2 bg-brand-electric text-brand-pure rounded-lg hover:bg-brand-neon transition-colors duration-200">
                      Update Password
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-brand-void dark:text-brand-pure mb-4">Theme</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => theme === 'dark' && toggleTheme()}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    theme === 'light' 
                      ? 'border-brand-electric bg-brand-electric/10' 
                      : 'border-brand-frost/30 dark:border-brand-zinc/30 hover:border-brand-electric/50'
                  }`}
                >
                  <div className="w-16 h-12 bg-white rounded mb-3 mx-auto shadow-sm"></div>
                  <h4 className="font-medium text-brand-void dark:text-brand-pure">Light Mode</h4>
                  <p className="text-sm text-brand-zinc dark:text-brand-frost">Clean and bright interface</p>
                </button>
                <button
                  onClick={() => theme === 'light' && toggleTheme()}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    theme === 'dark' 
                      ? 'border-brand-electric bg-brand-electric/10' 
                      : 'border-brand-frost/30 dark:border-brand-zinc/30 hover:border-brand-electric/50'
                  }`}
                >
                  <div className="w-16 h-12 bg-gray-800 rounded mb-3 mx-auto"></div>
                  <h4 className="font-medium text-brand-void dark:text-brand-pure">Dark Mode</h4>
                  <p className="text-sm text-brand-zinc dark:text-brand-frost">Easy on the eyes</p>
                </button>
              </div>
            </div>
          </div>
        );

      case 'data':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-brand-void dark:text-brand-pure mb-4">Export Data</h3>
              <div className="p-4 bg-brand-frost/10 dark:bg-brand-carbon/30 rounded-lg">
                <h4 className="font-medium text-brand-void dark:text-brand-pure mb-2">Download Your Data</h4>
                <p className="text-sm text-brand-zinc dark:text-brand-frost mb-4">
                  Export all your analytics data, reports, and account information. This includes your social media insights, 
                  generated reports, and account settings.
                </p>
                <button
                  onClick={handleExportData}
                  className="flex items-center gap-2 px-4 py-2 bg-brand-electric text-brand-pure rounded-lg hover:bg-brand-neon transition-colors duration-200"
                >
                  <Download size={16} />
                  Export Data
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-error-600 dark:text-error-400 mb-4">Danger Zone</h3>
              <div className="p-4 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg">
                <h4 className="font-medium text-error-600 dark:text-error-400 mb-2">Delete Account</h4>
                <p className="text-sm text-error-600 dark:text-error-400 mb-4">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <button
                  onClick={handleDeleteAccount}
                  className="flex items-center gap-2 px-4 py-2 bg-error-600 dark:bg-error-500 text-white rounded-lg hover:bg-error-700 dark:hover:bg-error-600 transition-colors duration-200"
                >
                  <Trash2 size={16} />
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <SettingsIcon size={28} className="text-brand-electric" />
            <h1 className="text-3xl font-bold text-brand-void dark:text-brand-pure">Settings</h1>
          </div>
          <p className="text-brand-zinc dark:text-brand-frost">
            Manage your account preferences and application settings.
          </p>
        </div>
        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 px-4 py-2 bg-brand-lime/10 text-brand-lime rounded-lg"
          >
            <CheckCircle2 size={16} />
            <span className="text-sm font-medium">Settings saved!</span>
          </motion.div>
        )}
      </motion.div>

      {/* Settings Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div className="bg-brand-pure/80 dark:bg-brand-carbon/60 backdrop-blur-sm rounded-xl p-4 border border-brand-frost/30 dark:border-brand-zinc/40 shadow-brand">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-brand-electric text-brand-pure shadow-electric-glow'
                      : 'text-brand-zinc dark:text-brand-frost hover:bg-brand-frost/10 dark:hover:bg-brand-carbon/30 hover:text-brand-electric'
                  }`}
                >
                  <tab.icon size={18} />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-3"
        >
          <div className="bg-brand-pure/80 dark:bg-brand-carbon/60 backdrop-blur-sm rounded-xl p-6 border border-brand-frost/30 dark:border-brand-zinc/40 shadow-brand">
            <TabContent />
            
            {activeTab !== 'data' && (
              <div className="flex items-center justify-end pt-6 border-t border-brand-frost/20 dark:border-brand-zinc/30 mt-6">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-6 py-3 bg-brand-electric text-brand-pure rounded-lg hover:bg-brand-neon transition-all duration-200 shadow-electric-glow hover:shadow-electric-glow"
                >
                  <Save size={16} />
                  <span className="font-medium">Save Changes</span>
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;