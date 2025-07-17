import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Plus, 
  Instagram, 
  Facebook, 
  RefreshCw, 
  Settings, 
  Trash2, 
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Eye,
  EyeOff,
  Wifi,
  WifiOff,
  Crown,
  Zap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Accounts = () => {
  const { user } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshing, setRefreshing] = useState<string | null>(null);

  // Mock connected accounts data
  const [connectedAccounts, setConnectedAccounts] = useState([
    {
      id: '1',
      platform: 'instagram',
      username: '@yourhandle',
      displayName: 'Your Business',
      profileImage: null,
      followers: 12500,
      accountType: 'business',
      isActive: true,
      lastSync: '2 minutes ago',
      syncStatus: 'success',
      permissions: ['read_insights', 'read_pages'],
      connectedAt: '2024-01-15',
      metrics: {
        posts: 245,
        engagement: 8.5,
        reach: 45600
      }
    },
    {
      id: '2',
      platform: 'facebook',
      username: 'Your Business Page',
      displayName: 'Your Business',
      profileImage: null,
      followers: 2740,
      accountType: 'page',
      isActive: true,
      lastSync: '5 minutes ago',
      syncStatus: 'success',
      permissions: ['pages_read_engagement', 'pages_show_list'],
      connectedAt: '2024-01-10',
      metrics: {
        posts: 89,
        engagement: 6.2,
        reach: 18900
      }
    },
    {
      id: '3',
      platform: 'instagram',
      username: '@personalbrand',
      displayName: 'Personal Brand',
      profileImage: null,
      followers: 5600,
      accountType: 'creator',
      isActive: false,
      lastSync: '2 hours ago',
      syncStatus: 'error',
      permissions: ['read_insights'],
      connectedAt: '2024-01-20',
      metrics: {
        posts: 156,
        engagement: 7.1,
        reach: 22300
      }
    }
  ]);

  const planLimits = {
    free: { accounts: 1, features: ['Basic analytics'] },
    pro: { accounts: 3, features: ['Advanced analytics', 'AI insights'] },
    business: { accounts: 5, features: ['Full analytics', 'Reports', 'Scheduling'] },
    agency: { accounts: 10, features: ['All features', 'White-label', 'Team collaboration'] }
  };

  const currentPlan = planLimits[user?.role as keyof typeof planLimits] || planLimits.free;

  const handleRefreshAccount = async (accountId: string) => {
    setRefreshing(accountId);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(null);
      // Update account sync status
      setConnectedAccounts(prev => 
        prev.map(acc => 
          acc.id === accountId 
            ? { ...acc, lastSync: 'Just now', syncStatus: 'success' }
            : acc
        )
      );
    }, 2000);
  };

  const handleToggleAccount = (accountId: string) => {
    setConnectedAccounts(prev =>
      prev.map(acc =>
        acc.id === accountId ? { ...acc, isActive: !acc.isActive } : acc
      )
    );
  };

  const handleDeleteAccount = (accountId: string) => {
    if (window.confirm('Are you sure you want to disconnect this account?')) {
      setConnectedAccounts(prev => prev.filter(acc => acc.id !== accountId));
    }
  };

  const getSyncStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return { icon: CheckCircle2, color: 'text-brand-lime', bg: 'bg-brand-lime/10' };
      case 'error':
        return { icon: AlertTriangle, color: 'text-error-500', bg: 'bg-error-50 dark:bg-error-900/20' };
      case 'syncing':
        return { icon: RefreshCw, color: 'text-brand-amber', bg: 'bg-brand-amber/10' };
      default:
        return { icon: Clock, color: 'text-brand-zinc', bg: 'bg-brand-zinc/10' };
    }
  };

  const AccountCard = ({ account }: any) => {
    const syncStatus = getSyncStatusBadge(account.syncStatus);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-brand-pure/80 dark:bg-brand-carbon/60 backdrop-blur-sm rounded-xl p-6 border border-brand-frost/30 dark:border-brand-zinc/40 shadow-brand hover:shadow-brand-lg transition-all duration-300 ${
          !account.isActive ? 'opacity-75' : ''
        }`}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 bg-brand-electric/10 rounded-xl flex items-center justify-center">
                {account.platform === 'instagram' ? (
                  <Instagram size={28} className="text-brand-electric" />
                ) : (
                  <Facebook size={28} className="text-brand-electric" />
                )}
              </div>
              <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-brand-pure dark:border-brand-carbon flex items-center justify-center ${
                account.isActive ? 'bg-brand-lime' : 'bg-brand-zinc'
              }`}>
                {account.isActive ? (
                  <Wifi size={10} className="text-brand-pure" />
                ) : (
                  <WifiOff size={10} className="text-brand-pure" />
                )}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-brand-void dark:text-brand-pure text-lg">{account.username}</h3>
              <p className="text-sm text-brand-zinc dark:text-brand-frost">{account.displayName}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-brand-zinc dark:text-brand-frost">
                  {account.followers.toLocaleString()} followers
                </span>
                <span className="px-2 py-1 bg-brand-electric/10 text-brand-electric text-xs rounded-full">
                  {account.accountType}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleToggleAccount(account.id)}
              className={`p-2 rounded-lg transition-all duration-200 ${
                account.isActive 
                  ? 'text-brand-lime hover:bg-brand-lime/10' 
                  : 'text-brand-zinc hover:bg-brand-zinc/10'
              }`}
            >
              {account.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
            <button
              onClick={() => handleRefreshAccount(account.id)}
              disabled={refreshing === account.id}
              className="p-2 text-brand-electric hover:bg-brand-electric/10 rounded-lg transition-all duration-200 disabled:opacity-50"
            >
              <RefreshCw size={16} className={refreshing === account.id ? 'animate-spin' : ''} />
            </button>
            <button className="p-2 text-brand-zinc dark:text-brand-frost hover:text-brand-electric hover:bg-brand-electric/10 rounded-lg transition-all duration-200">
              <Settings size={16} />
            </button>
            <button
              onClick={() => handleDeleteAccount(account.id)}
              className="p-2 text-brand-zinc dark:text-brand-frost hover:text-error-500 hover:bg-error-50 dark:hover:bg-error-900/20 rounded-lg transition-all duration-200"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-lg font-bold text-brand-void dark:text-brand-pure">{account.metrics.posts}</div>
            <div className="text-xs text-brand-zinc dark:text-brand-frost">Posts</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-brand-void dark:text-brand-pure">{account.metrics.engagement}%</div>
            <div className="text-xs text-brand-zinc dark:text-brand-frost">Engagement</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-brand-void dark:text-brand-pure">{account.metrics.reach.toLocaleString()}</div>
            <div className="text-xs text-brand-zinc dark:text-brand-frost">Reach</div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-brand-frost/20 dark:border-brand-zinc/30">
          <div className="flex items-center gap-2">
            <div className={`p-1 rounded ${syncStatus.bg}`}>
              <syncStatus.icon size={12} className={syncStatus.color} />
            </div>
            <span className="text-sm text-brand-zinc dark:text-brand-frost">
              Last sync: {account.lastSync}
            </span>
          </div>
          <button className="text-brand-electric hover:text-brand-neon text-sm font-medium transition-colors duration-200 flex items-center gap-1">
            View Details
            <ExternalLink size={12} />
          </button>
        </div>
      </motion.div>
    );
  };

  const canAddMore = connectedAccounts.length < currentPlan.accounts;

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
            <Users size={28} className="text-brand-electric" />
            <h1 className="text-3xl font-bold text-brand-void dark:text-brand-pure">Social Accounts</h1>
          </div>
          <p className="text-brand-zinc dark:text-brand-frost">
            Manage your connected social media accounts and their synchronization settings.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          disabled={!canAddMore}
          className="flex items-center gap-2 px-6 py-3 bg-brand-electric text-brand-pure rounded-lg hover:bg-brand-neon transition-all duration-200 shadow-electric-glow hover:shadow-electric-glow disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={18} />
          <span className="font-medium">Connect Account</span>
        </button>
      </motion.div>

      {/* Plan Limits */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-brand-electric/10 to-brand-neon/10 dark:from-brand-carbon/60 dark:to-brand-zinc/40 rounded-xl p-6 border border-brand-electric/20 dark:border-brand-zinc/30"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Crown size={24} className="text-brand-electric" />
            <div>
              <h3 className="font-semibold text-brand-void dark:text-brand-pure">
                {(user?.role
                    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                    : 'Free')} Plan
              </h3>
              <p className="text-sm text-brand-zinc dark:text-brand-frost">
                {connectedAccounts.length}/{currentPlan.accounts} accounts used
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-brand-zinc dark:text-brand-frost">Includes:</div>
              <div className="text-xs text-brand-zinc/60 dark:text-brand-frost/60">
                {currentPlan.features.join(', ')}
              </div>
            </div>
            {user?.role === 'free' && (
              <button className="px-4 py-2 bg-brand-electric text-brand-pure rounded-lg hover:bg-brand-neon transition-colors duration-200">
                Upgrade
              </button>
            )}
          </div>
        </div>
        <div className="mt-4">
          <div className="w-full bg-brand-frost/20 dark:bg-brand-zinc/20 rounded-full h-2">
            <div 
              className="bg-brand-electric h-2 rounded-full transition-all duration-300"
              style={{ width: `${(connectedAccounts.length / currentPlan.accounts) * 100}%` }}
            ></div>
          </div>
        </div>
      </motion.div>

      {/* Connected Accounts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-brand-pure/80 dark:bg-brand-carbon/60 backdrop-blur-sm rounded-xl p-6 border border-brand-frost/30 dark:border-brand-zinc/40 shadow-brand"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-brand-void dark:text-brand-pure">Connected Accounts</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-brand-zinc dark:text-brand-frost">
              {connectedAccounts.filter(acc => acc.isActive).length} active
            </span>
          </div>
        </div>

        {connectedAccounts.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {connectedAccounts.map((account) => (
              <AccountCard key={account.id} account={account} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Users size={48} className="text-brand-zinc/50 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-brand-void dark:text-brand-pure mb-2">No accounts connected</h3>
            <p className="text-brand-zinc dark:text-brand-frost mb-6">
              Connect your first social media account to start analyzing your performance.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-brand-electric text-brand-pure rounded-lg hover:bg-brand-neon transition-all duration-200"
            >
              Connect Your First Account
            </button>
          </div>
        )}
      </motion.div>

      {/* Add Account Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-brand-void/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-brand-pure dark:bg-brand-carbon rounded-2xl p-6 max-w-md w-full border border-brand-frost/30 dark:border-brand-zinc/40 shadow-brand-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-brand-void dark:text-brand-pure">Connect Account</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 text-brand-zinc dark:text-brand-frost hover:text-error-500 transition-colors duration-200"
              >
                ✕
              </button>
            </div>

            {!canAddMore && (
              <div className="mb-6 p-4 bg-brand-amber/10 border border-brand-amber/20 rounded-lg">
                <div className="flex items-center gap-2 text-brand-amber mb-2">
                  <AlertTriangle size={16} />
                  <span className="font-medium">Account Limit Reached</span>
                </div>
                <p className="text-sm text-brand-zinc dark:text-brand-frost">
                  You've reached the maximum number of accounts for your plan. Upgrade to connect more accounts.
                </p>
              </div>
            )}

            <div className="space-y-4">
              <button
                disabled={!canAddMore}
                className="w-full flex items-center gap-4 p-4 bg-brand-frost/10 dark:bg-brand-carbon/30 rounded-lg border border-brand-frost/20 dark:border-brand-zinc/30 hover:bg-brand-electric/10 hover:border-brand-electric/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Instagram size={24} className="text-brand-electric" />
                <div className="text-left">
                  <h3 className="font-medium text-brand-void dark:text-brand-pure">Instagram</h3>
                  <p className="text-sm text-brand-zinc dark:text-brand-frost">Connect your Instagram Business or Creator account</p>
                </div>
              </button>

              <button
                disabled={!canAddMore}
                className="w-full flex items-center gap-4 p-4 bg-brand-frost/10 dark:bg-brand-carbon/30 rounded-lg border border-brand-frost/20 dark:border-brand-zinc/30 hover:bg-brand-electric/10 hover:border-brand-electric/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Facebook size={24} className="text-brand-electric" />
                <div className="text-left">
                  <h3 className="font-medium text-brand-void dark:text-brand-pure">Facebook</h3>
                  <p className="text-sm text-brand-zinc dark:text-brand-frost">Connect your Facebook Page for insights</p>
                </div>
              </button>
            </div>

            <div className="mt-6 p-4 bg-brand-frost/10 dark:bg-brand-carbon/30 rounded-lg">
              <div className="flex items-center gap-2 text-brand-electric mb-2">
                <Zap size={16} />
                <span className="font-medium text-sm">Secure Connection</span>
              </div>
              <p className="text-xs text-brand-zinc dark:text-brand-frost">
                We use OAuth2 for secure authentication. Your passwords are never stored.
              </p>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-brand-frost/20 dark:border-brand-zinc/30">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-brand-frost/30 dark:border-brand-zinc/40 text-brand-zinc dark:text-brand-frost rounded-lg hover:bg-brand-frost/10 dark:hover:bg-brand-carbon/30 transition-all duration-200"
              >
                Cancel
              </button>
              {!canAddMore && (
                <button className="px-4 py-2 bg-brand-violet text-brand-pure rounded-lg hover:bg-brand-violet/80 transition-colors duration-200">
                  Upgrade Plan
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Accounts;