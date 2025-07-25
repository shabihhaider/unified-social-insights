import { CheckCircle2, AlertTriangle, RefreshCw, Clock } from 'lucide-react';

export const SYNC_STATUS_CONFIG = {
  success: { icon: CheckCircle2, color: 'text-brand-lime', bg: 'bg-brand-lime/10' },
  error: { icon: AlertTriangle, color: 'text-error-500', bg: 'bg-error-50 dark:bg-error-900/20' },
  syncing: { icon: RefreshCw, color: 'text-brand-amber', bg: 'bg-brand-amber/10' },
  pending: { icon: Clock, color: 'text-brand-zinc', bg: 'bg-brand-zinc/10' },
} as const;
