export const Roles = {
  traveler: 'traveler',
  providerOwner: 'provider_owner',
  providerAdmin: 'provider_admin',
  providerManager: 'provider_manager',
  providerStaff: 'provider_staff',
  guide: 'guide',
  driver: 'driver',
  creator: 'creator',
  supportAgent: 'support_agent',
  financeAdmin: 'finance_admin',
  trustSafetyAdmin: 'trust_safety_admin',
  platformAdmin: 'platform_admin',
  superAdmin: 'super_admin',
} as const;

export const Permissions = {
  profileRead: 'profile.read',
  profileWrite: 'profile.write',
  listingRead: 'listing.read',
  listingWrite: 'listing.write',
  listingModerate: 'listing.moderate',
  bookingCreate: 'booking.create',
  bookingUpdate: 'booking.update',
  bookingOverride: 'booking.override',
  paymentCreate: 'payment.create',
  paymentRefund: 'payment.refund',
  paymentSettle: 'payment.settle',
  payoutApprove: 'payout.approve',
  auditRead: 'audit.read',
} as const;

export const EventTopics = {
  auth: 'auth.events',
  vendor: 'vendor.events',
  listing: 'listing.events',
  searchIndexing: 'search.indexing',
  booking: 'booking.events',
  payment: 'payment.events',
  inventory: 'inventory.events',
  pricing: 'pricing.events',
  notification: 'notification.events',
  audit: 'audit.events',
} as const;
