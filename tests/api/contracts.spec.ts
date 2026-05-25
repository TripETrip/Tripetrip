import { describe, expect, it } from 'vitest';
import { EventTopics, Permissions, Roles } from '../../packages/constants/src/index';
import { CreateBookingSchema, RegisterProviderSchema } from '../../packages/validators/src/index';

describe('shared contracts', () => {
  it('defines enterprise RBAC roles and permissions', () => {
    expect(Roles.platformAdmin).toBe('platform_admin');
    expect(Permissions.paymentSettle).toBe('payment.settle');
  });

  it('validates provider registration payloads', () => {
    const result = RegisterProviderSchema.safeParse({
      email: 'owner@tripetrip.com',
      password: 'StrongPass123!',
      businessName: 'Himalayan Stays',
      businessType: 'homestay',
      ownerName: 'Asha Devi',
      phone: '+919999999999',
    });

    expect(result.success).toBe(true);
  });

  it('rejects invalid booking payloads', () => {
    const result = CreateBookingSchema.safeParse({
      listingId: '',
      startDate: 'not-a-date',
      guestCount: 0,
    });

    expect(result.success).toBe(false);
  });

  it('defines event topics for async architecture', () => {
    expect(EventTopics.booking).toBe('booking.events');
    expect(EventTopics.payment).toBe('payment.events');
  });
});
