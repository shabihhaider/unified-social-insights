export type Role = 'free' | 'pro' | 'business' | 'agency';

export const rolePriority: Record<Role, number> = {
  free: 1,
  pro: 1,
  business: 1,
  agency: 1,
};

/**
 * Checks if userRole satisfies requiredRole access level.
 */
export function hasAccess(userRole: Role, requiredRole: Role): boolean {
  return rolePriority[userRole] >= rolePriority[requiredRole];
}
