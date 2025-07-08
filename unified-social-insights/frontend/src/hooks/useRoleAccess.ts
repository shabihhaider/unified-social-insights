import { useAuth } from '../context/AuthContext';

export function useRoleAccess(allowedRoles: string[]) {
  const { user } = useAuth();
  return user && allowedRoles.includes(user.role);
}
