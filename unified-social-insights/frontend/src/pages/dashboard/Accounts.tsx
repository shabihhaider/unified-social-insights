import React, { useState, useEffect, useCallback, useMemo } from 'react';

import { PLAN_LIMITS } from '../../constants/accountPlans';
import { SYNC_STATUS_CONFIG } from '../../constants/syncStatus';
import { SocialAccount } from '../../types/accounts';
import TooltipButton from '../../components/Accounts/TooltipButton';
import SkeletonCard from '../../components/Accounts/SkeletonCard';
import AccountCard from '../../components/Accounts/AccountsCard';

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
  Zap,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { socialAccountsAPI } from '../../services/socialAccounts';
import { fetchFacebookOAuthConfig } from "../../services/oauthConfig";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Accounts = () => {
  const { user } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshing, setRefreshing] = useState<string | null>(null);
  const [connectedAccounts, setConnectedAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoized values
  const currentPlan = useMemo(() => 
    PLAN_LIMITS[user?.role as keyof typeof PLAN_LIMITS] || PLAN_LIMITS.free,
    [user?.role]
  );

  const canAddMore = useMemo(() => 
    connectedAccounts.length < currentPlan.accounts,
    [connectedAccounts.length, currentPlan.accounts]
  );

  const activeAccountsCount = useMemo(() => 
    connectedAccounts.filter(acc => acc.isActive).length,
    [connectedAccounts]
  );

  const planTitle = useMemo(() => 
    user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Free',
    [user?.role]
  );

  // Optimized fetch function with useCallback
  const fetchAccounts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await socialAccountsAPI.getAccounts();
      
      if (response?.success) {
        setConnectedAccounts(response.accounts || []);
      } else {
        setError(response?.message || 'Failed to load accounts');
      }
    } catch (err) {
      console.error('Error fetching accounts:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch accounts');
    } finally {
      setLoading(false);
    }
  }, []);

  // URL parameter handling
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    const linked = urlParams.get('linked');

    if (error === 'oauth_failed') {
      toast.warn('Connected, but no analytics data available yet.');
    } else if (error) {
      toast.error(`Connection Failed: ${error}`);
      setError(`Connection Failed: ${error}`);
    } else if (linked === 'facebook' || linked === 'instagram') {
      setError(null);
      toast.success(`${linked.charAt(0).toUpperCase() + linked.slice(1)} account linked successfully!`);
      fetchAccounts();
    }

    if (error || linked) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [fetchAccounts]);


  // Initial fetch
  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  // Optimized handlers with useCallback
  const handleRefreshAccount = useCallback(async (accountId: string) => {
    try {
      setRefreshing(accountId);
      const response = await socialAccountsAPI.refreshAccount(accountId);
      
      if (response.success) {
        setConnectedAccounts(prev => 
          prev.map(acc => 
            acc.id === accountId 
              ? { ...acc, lastSync: 'Just now', syncStatus: 'syncing' as const }
              : acc
          )
        );
        
        setTimeout(fetchAccounts, 2000);
      }
    } catch (err) {
      console.error('Error refreshing account:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh account');
    } finally {
      setRefreshing(null);
    }
  }, [fetchAccounts]);

  const handleToggleAccount = useCallback(async (accountId: string) => {
    const account = connectedAccounts.find(acc => acc.id === accountId);
    if (!account) return;

    try {
      const response = await socialAccountsAPI.toggleAccount(accountId, !account.isActive);
      
      if (response.success) {
        setConnectedAccounts(prev =>
          prev.map(acc =>
            acc.id === accountId ? { ...acc, isActive: !acc.isActive } : acc
          )
        );
      }
    } catch (err) {
      console.error('Error toggling account:', err);
      setError(err instanceof Error ? err.message : 'Failed to toggle account');
    }
  }, [connectedAccounts]);

  const handleDeleteAccount = useCallback(async (accountId: string) => {
    if (!window.confirm('Are you sure you want to disconnect this account?')) {
      return;
    }

    try {
      const response = await socialAccountsAPI.deleteAccount(accountId);
      
      if (response.success) {
        setConnectedAccounts(prev => prev.filter(acc => acc.id !== accountId));
      }
    } catch (err) {
      console.error('Error deleting account:', err);
      setError(err instanceof Error ? err.message : 'Failed to disconnect account');
    }
  }, []);

  const handleConnectFacebook = useCallback(async () => {
    try {
      const config = await fetchFacebookOAuthConfig();

      if (!config.facebookAppId || !config.facebookRedirectUri) {
        console.error("Missing Facebook config");
        return;
      }

      const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${config.facebookAppId}&redirect_uri=${encodeURIComponent(config.facebookRedirectUri)}&scope=pages_show_list,pages_read_engagement,pages_read_user_content,instagram_basic,instagram_manage_insights&response_type=code`;
      
      toast.info("Redirecting to Facebook...");
      window.location.href = authUrl;
    } catch (error) {
      console.error("Facebook OAuth failed", error);
    }
  }, []);

  const handleConnectInstagram = useCallback(() => {
    try {
      socialAccountsAPI.initiateInstagramAuth();
    } catch (err) {
      console.error('Error initiating Instagram auth:', err);
      setError('Failed to connect to Instagram');
    }
  }, []);

  const closeModal = useCallback(() => setShowAddModal(false), []);
  const openModal = useCallback(() => setShowAddModal(true), []);
  const dismissError = useCallback(() => setError(null), []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3">
          <Loader2 size={24} className="text-brand-electric animate-spin" />
          <span className="text-brand-zinc dark:text-brand-frost">Loading your accounts...</span>
        </div>
      </div>
    );
  }

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
          onClick={openModal}
          disabled={!canAddMore}
          className="flex items-center gap-2 px-6 py-3 bg-brand-electric text-brand-pure rounded-lg hover:bg-brand-neon transition-all duration-200 shadow-electric-glow hover:shadow-electric-glow disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={18} />
          <span className="font-medium">Connect Account</span>
        </button>
      </motion.div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-xl p-4"
        >
          <div className="flex items-center gap-2 text-error-600 dark:text-error-400">
            <AlertTriangle size={16} />
            <span className="font-medium">Error</span>
          </div>
          <p className="text-sm text-error-700 dark:text-error-300 mt-1">{error}</p>
          <button
            onClick={dismissError}
            className="text-xs text-error-600 dark:text-error-400 hover:underline mt-2"
          >
            Dismiss
          </button>
        </motion.div>
      )}

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
                {planTitle} Plan
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
              {activeAccountsCount} active
            </span>
            <button
              onClick={fetchAccounts}
              className="p-1 text-brand-zinc dark:text-brand-frost hover:text-brand-electric transition-colors duration-200"
              title="Refresh accounts list"
            >
              <RefreshCw size={14} />
            </button>
          </div>
        </div>

        {connectedAccounts.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {connectedAccounts.map((account) => (
              <AccountCard 
                key={account.id} 
                account={account}
                onRefresh={handleRefreshAccount}
                onToggle={handleToggleAccount}
                onDelete={handleDeleteAccount}
                isRefreshing={refreshing === account.id}
              />
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
              onClick={openModal}
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
                onClick={closeModal}
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
                onClick={handleConnectInstagram}
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
                onClick={handleConnectFacebook}
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
                onClick={closeModal}
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