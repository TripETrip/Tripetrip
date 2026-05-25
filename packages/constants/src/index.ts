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
  crm: 'crm.events',
  operations: 'operations.events',
  ai: 'ai.events',
  community: 'community.events',
  trustSafety: 'trust_safety.events',
  transport: 'transport.events',
  notification: 'notification.events',
  audit: 'audit.events',
} as const;

export const BookingStatuses = {
  draft: 'draft',
  inventoryLocked: 'inventory_locked',
  pendingPayment: 'pending_payment',
  escrowed: 'escrowed',
  confirmed: 'confirmed',
  checkedIn: 'checked_in',
  settlementPending: 'settlement_pending',
  settled: 'settled',
  completed: 'completed',
  abandoned: 'abandoned',
  expired: 'expired',
  failed: 'failed',
  cancellationRequested: 'cancellation_requested',
  refundPending: 'refund_pending',
  refunded: 'refunded',
} as const;

export const BookingEventTypes = {
  created: 'booking.created',
  inventoryLocked: 'inventory.locked',
  pendingPayment: 'booking.pending_payment',
  paymentEscrowed: 'booking.payment_escrowed',
  confirmed: 'booking.confirmed',
  checkedIn: 'booking.checked_in',
  settlementPending: 'booking.settlement_pending',
  settled: 'booking.settled',
  completed: 'booking.completed',
} as const;

export const PaymentProviders = {
  razorpay: 'razorpay',
  stripe: 'stripe',
  upi: 'upi',
  wallet: 'wallet',
} as const;

export const PaymentStatuses = {
  orderCreated: 'order_created',
  escrowed: 'escrowed',
  settlementPending: 'settlement_pending',
  settled: 'settled',
  refundPending: 'refund_pending',
  refunded: 'refunded',
  failed: 'failed',
} as const;

export const PaymentEventTypes = {
  orderCreated: 'payment.order_created',
  capturedToEscrow: 'payment.captured_to_escrow',
  settlementReleased: 'payment.settlement_released',
  refundPending: 'payment.refund_pending',
  refunded: 'payment.refunded',
  failed: 'payment.failed',
} as const;

export const LedgerEntryTypes = {
  travelerDebit: 'traveler_debit',
  escrowCredit: 'escrow_credit',
  escrowDebit: 'escrow_debit',
  vendorWalletCredit: 'vendor_wallet_credit',
  refundDebit: 'refund_debit',
  travelerRefundCredit: 'traveler_refund_credit',
} as const;
