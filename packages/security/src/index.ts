import type { Permission, Role } from '../../types/src/index';

export interface AccessPolicy {
  role: Role;
  permissions: Permission[];
}

export function hasPermission(policy: AccessPolicy, permission: Permission) {
  return policy.permissions.includes(permission);
}
