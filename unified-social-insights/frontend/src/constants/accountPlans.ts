export const PLAN_LIMITS = {
  free: { accounts: 1, features: ['Basic analytics'] },
  pro: { accounts: 3, features: ['Advanced analytics', 'AI insights'] },
  business: { accounts: 5, features: ['Full analytics', 'Reports', 'Scheduling'] },
  agency: { accounts: 10, features: ['All features', 'White-label', 'Team collaboration'] },
} as const;
