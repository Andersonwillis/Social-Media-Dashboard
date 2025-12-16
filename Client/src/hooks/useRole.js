import { useUser } from '@clerk/clerk-react';

// Role definitions
export const ROLES = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  VIEWER: 'viewer'
};

// Hook to check user roles
export function useRole() {
  const { user } = useUser();
  
  // Get role from user's public metadata
  // You'll need to set this in Clerk Dashboard under user metadata
  const userRole = user?.publicMetadata?.role || ROLES.VIEWER;
  
  const hasRole = (role) => {
    if (!user) return false;
    return userRole === role;
  };
  
  const can = (permission) => {
    if (!user) return false;
    
    const permissions = {
      [ROLES.ADMIN]: ['edit', 'delete', 'view', 'manage_users'],
      [ROLES.EDITOR]: ['edit', 'view'],
      [ROLES.VIEWER]: ['view']
    };
    
    return permissions[userRole]?.includes(permission) || false;
  };
  
  return {
    role: userRole,
    isAdmin: hasRole(ROLES.ADMIN),
    isEditor: hasRole(ROLES.EDITOR),
    isViewer: hasRole(ROLES.VIEWER),
    can,
    hasRole
  };
}

// Component to conditionally render based on role
export function RequireRole({ role, children, fallback = null }) {
  const { hasRole: checkRole } = useRole();
  
  if (!checkRole(role)) {
    return fallback;
  }
  
  return children;
}

// Component to conditionally render based on permission
export function RequirePermission({ permission, children, fallback = null }) {
  const { can } = useRole();
  
  if (!can(permission)) {
    return fallback;
  }
  
  return children;
}
