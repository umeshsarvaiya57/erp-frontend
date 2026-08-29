/**
 * Utility to verify if a user has a specific module/action permission.
 * Super Admin and Tenant Owners are granted all actions automatically.
 */
export const hasPermission = (user, requiredPermission) => {
  if (!user) return false;
  
  // Super Admin and Tenant Business Owners bypass module check
  if (user.role === 'SUPER_ADMIN' || user.role === 'OWNER') {
    return true;
  }

  // Verify custom role/user permissions list
  if (Array.isArray(user.permissions)) {
    return user.permissions.includes(requiredPermission);
  }

  return false;
};

export default hasPermission;
