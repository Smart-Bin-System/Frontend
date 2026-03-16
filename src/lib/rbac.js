import { ROLE_PERMISSIONS } from "@/constants/permissions";
import { ROLES } from "@/constants/roles";

export function normalizeRole(role) {
  if (!role) return ROLES.WORKER;

  const value = String(role).toLowerCase();

  if (Object.values(ROLES).includes(value)) {
    return value;
  }

  return ROLES.WORKER;
}

export function getPermissionsForRole(role) {
  const normalizedRole = normalizeRole(role);
  return ROLE_PERMISSIONS[normalizedRole] || [];
}

export function hasPermission(user, permission) {
  if (!user) return false;

  const permissions = user.permissions?.length
    ? user.permissions
    : getPermissionsForRole(user.role);

  return permissions.includes(permission);
}

export function hasAnyPermission(user, permissionList = []) {
  return permissionList.some((permission) => hasPermission(user, permission));
}
