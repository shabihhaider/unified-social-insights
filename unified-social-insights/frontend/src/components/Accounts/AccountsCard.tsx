import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Instagram,
  Facebook,
  Wifi,
  WifiOff,
  Eye,
  EyeOff,
  RefreshCw,
  Settings,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { SYNC_STATUS_CONFIG } from '../../constants/syncStatus';
import { SocialAccount } from '../../types/accounts';
import TooltipButton from './TooltipButton';

interface Props {
  account: SocialAccount;
  onRefresh: (id: string) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  isRefreshing: boolean;
}

const AccountCard = ({ account, onRefresh, onToggle, onDelete, isRefreshing }: Props) => {
  const syncStatus = SYNC_STATUS_CONFIG[account.syncStatus] || SYNC_STATUS_CONFIG.pending;

  const formatMetricValue = useCallback((value: number | undefined) => {
    if (typeof value !== 'number') return '—';
    return value > 999 ? value.toLocaleString() : value.toString();
  }, []);

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
            {account.profileImage ? (
              <img
                src={account.profileImage}
                alt={account.displayName}
                className="w-16 h-16 rounded-xl object-cover"
              />
            ) : (
              <div className="w-16 h-16 bg-brand-electric/10 rounded-xl flex items-center justify-center">
                {account.platform === 'instagram' ? (
                  <Instagram size={28} className="text-brand-electric" />
                ) : (
                  <Facebook size={28} className="text-brand-electric" />
                )}
              </div>
            )}
            <div
              className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-brand-pure dark:border-brand-carbon flex items-center justify-center ${
                account.isActive ? 'bg-brand-lime' : 'bg-brand-zinc'
              }`}
            >
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
                {formatMetricValue(account.followers)} followers
              </span>
              <span className="px-2 py-1 bg-brand-electric/10 text-brand-electric text-xs rounded-full capitalize">
                {account.accountType}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TooltipButton
            onClick={() => onToggle(account.id)}
            className={`p-2 rounded-lg transition-all duration-200 ${
              account.isActive ? 'text-brand-lime hover:bg-brand-lime/10' : 'text-brand-zinc hover:bg-brand-zinc/10'
            }`}
            title={account.isActive ? 'Deactivate account' : 'Activate account'}
          >
            {account.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
          </TooltipButton>

          <TooltipButton
            onClick={() => onRefresh(account.id)}
            disabled={isRefreshing}
            className="p-2 text-brand-electric hover:bg-brand-electric/10 rounded-lg transition-all duration-200 disabled:opacity-50"
            title="Refresh account data"
          >
            <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
          </TooltipButton>

          <TooltipButton
            onClick={() => {}}
            className="p-2 text-brand-zinc dark:text-brand-frost hover:text-brand-electric hover:bg-brand-electric/10 rounded-lg transition-all duration-200"
            title="Account settings"
          >
            <Settings size={16} />
          </TooltipButton>

          <TooltipButton
            onClick={() => onDelete(account.id)}
            className="p-2 text-brand-zinc dark:text-brand-frost hover:text-error-500 hover:bg-error-50 dark:hover:bg-error-900/20 rounded-lg transition-all duration-200"
            title="Disconnect account"
          >
            <Trash2 size={16} />
          </TooltipButton>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-lg font-bold text-brand-void dark:text-brand-pure">
            {formatMetricValue(account.metrics.posts)}
          </div>
          <div className="text-xs text-brand-zinc dark:text-brand-frost">Posts</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-brand-void dark:text-brand-pure">
            {formatMetricValue(account.metrics.engagement)}{typeof account.metrics.engagement === 'number' ? '%' : ''}
          </div>
          <div className="text-xs text-brand-zinc dark:text-brand-frost">Engagement</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-brand-void dark:text-brand-pure">
            {formatMetricValue(account.metrics.reach)}
          </div>
          <div className="text-xs text-brand-zinc dark:text-brand-frost">Reach</div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-brand-frost/20 dark:border-brand-zinc/30">
        <div className="flex items-center gap-2">
          <div className={`p-1 rounded ${syncStatus.bg}`}>
            <syncStatus.icon
              size={12}
              className={`${syncStatus.color} ${account.syncStatus === 'syncing' ? 'animate-spin' : ''}`}
            />
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

export default React.memo(AccountCard);
