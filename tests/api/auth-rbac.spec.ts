import { describe, expect, it } from 'vitest';
import { Permissions, Roles } from '../../packages/constants/src/index';
import { canAccess } from '../../packages/security/src/index';
import { AuthService } from '../../apps/api/src/modules/auth/auth.service';

describe('Auth and RBAC foundation', () => {
  it('allows provider owners to manage listings but not settle payments', () => {
    expect(canAccess(Roles.providerOwner, Permissions.listingWrite)).toBe(true);
    expect(canAccess(Roles.providerOwner, Permissions.paymentSettle)).toBe(false);
  });

  it('allows finance admins to settle payments and read audits', () => {
    expect(canAccess(Roles.financeAdmin, Permissions.paymentSettle)).toBe(true);
    expect(canAccess(Roles.financeAdmin, Permissions.auditRead)).toBe(true);
  });

  it('registers traveler accounts with traveler role', async () => {
    const service = new AuthService();
    const result = await service.registerTraveler({
      email: 'traveler@tripetrip.com',
      password: 'StrongPass123!',
      fullName: 'Trip Traveler',
      phone: '+919111111111',
    });

    expect(result.user.email).toBe('traveler@tripetrip.com');
    expect(result.user.role).toBe(Roles.traveler);
    expect(result.organization).toBeNull();
  });

  it('registers provider accounts with an organization context', async () => {
    const service = new AuthService();
    const result = await service.registerProvider({
      email: 'owner@tripetrip.com',
      password: 'StrongPass123!',
      businessName: 'Himalayan Stays',
      businessType: 'homestay',
      ownerName: 'Asha Devi',
      phone: '+919999999999',
    });

    expect(result.user.role).toBe(Roles.providerOwner);
    expect(result.organization?.name).toBe('Himalayan Stays');
    expect(result.organization?.slug).toBe('himalayan-stays');
  });

  it('rejects weak passwords before creating accounts', async () => {
    const service = new AuthService();

    await expect(
      service.registerTraveler({
        email: 'bad@tripetrip.com',
        password: 'short',
        fullName: 'Bad Password',
      }),
    ).rejects.toThrow('Password must be at least 10 characters');
  });
});
