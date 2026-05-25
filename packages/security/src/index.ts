import { Permissions, Roles } from '../../constants/src/index';
import type { Permission, Role } from '../../types/src/index';

export interface AccessPolicy {
  role: Role;
  permissions: Permission[];
}

export function hasPermission(policy: AccessPolicy, permission: Permission) {
  return policy.permissions.includes(permission);
}

export const RolePermissions: Record<Role, Permission[]> = {
  [Roles.traveler]: [
    Permissions.profileRead,
    Permissions.profileWrite,
    Permissions.listingRead,
    Permissions.bookingCreate,
  ],
  [Roles.providerOwner]: [
    Permissions.profileRead,
    Permissions.profileWrite,
    Permissions.listingRead,
    Permissions.listingWrite,
    Permissions.bookingUpdate,
  ],
  [Roles.providerAdmin]: [
    Permissions.profileRead,
    Permissions.listingRead,
    Permissions.listingWrite,
    Permissions.bookingUpdate,
  ],
  [Roles.providerManager]: [
    Permissions.profileRead,
    Permissions.listingRead,
    Permissions.bookingUpdate,
  ],
  [Roles.providerStaff]: [Permissions.profileRead, Permissions.bookingUpdate],
  [Roles.guide]: [Permissions.profileRead, Permissions.bookingUpdate],
  [Roles.driver]: [Permissions.profileRead, Permissions.bookingUpdate],
  [Roles.creator]: [Permissions.profileRead, Permissions.listingRead, Permissions.listingWrite],
  [Roles.supportAgent]: [Permissions.profileRead, Permissions.bookingOverride, Permissions.auditRead],
  [Roles.financeAdmin]: [
    Permissions.profileRead,
    Permissions.paymentCreate,
    Permissions.paymentRefund,
    Permissions.paymentSettle,
    Permissions.payoutApprove,
    Permissions.auditRead,
  ],
  [Roles.trustSafetyAdmin]: [
    Permissions.profileRead,
    Permissions.listingModerate,
    Permissions.bookingOverride,
    Permissions.auditRead,
  ],
  [Roles.platformAdmin]: [
    Permissions.profileRead,
    Permissions.profileWrite,
    Permissions.listingRead,
    Permissions.listingWrite,
    Permissions.listingModerate,
    Permissions.bookingCreate,
    Permissions.bookingUpdate,
    Permissions.bookingOverride,
    Permissions.paymentCreate,
    Permissions.paymentRefund,
    Permissions.paymentSettle,
    Permissions.payoutApprove,
    Permissions.auditRead,
  ],
  [Roles.superAdmin]: Object.values(Permissions),
};

export function canAccess(role: Role, permission: Permission) {
  return RolePermissions[role]?.includes(permission) ?? false;
}
