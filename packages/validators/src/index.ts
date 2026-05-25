import { z } from 'zod';

const CurrencySchema = z.string().length(3).transform((value) => value.toUpperCase());

export const RegisterProviderSchema = z.object({
  email: z.string().email(),
  password: z.string().min(10),
  businessName: z.string().min(2).max(160),
  businessType: z.string().min(2).max(80),
  ownerName: z.string().min(2).max(120),
  phone: z.string().min(8).max(20),
});

export const RegisterTravelerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(10, 'Password must be at least 10 characters'),
  fullName: z.string().min(2).max(120),
  phone: z.string().min(8).max(20).optional(),
});

export const CreateBookingSchema = z.object({
  listingId: z.string().uuid(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  guestCount: z.number().int().min(1, 'Number must be greater than or equal to 1').max(50),
  specialRequests: z.string().max(1000).optional(),
});

export const ListingSearchSchema = z.object({
  q: z.string().trim().max(120).optional(),
  category: z.string().trim().max(80).optional(),
  location: z.string().trim().max(120).optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
});

export const CreatePaymentOrderSchema = z.object({
  bookingId: z.string().uuid(),
  travelerId: z.string().uuid(),
  providerId: z.string().uuid(),
  amount: z.number().int().min(100, 'Amount must be at least 100 minor units'),
  currency: CurrencySchema.default('INR'),
  provider: z.enum(['razorpay', 'stripe', 'upi', 'wallet']),
});

export const CapturePaymentSchema = z.object({
  gatewayPaymentId: z.string().min(3).max(160),
  gatewaySignature: z.string().min(3).max(500),
});

export const ReleaseSettlementSchema = z.object({
  checkInValidated: z.boolean(),
  vendorWalletId: z.string().min(3).max(160),
});

export const GenerateItinerarySchema = z
  .object({
    destination: z.string().trim().min(2).max(120),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    travelerCount: z.number().int().min(1, 'Number must be greater than or equal to 1').max(50),
    budget: z.number().int().min(1000).optional(),
    interests: z.array(z.string().trim().min(2).max(80)).min(1).max(12),
  })
  .refine((value) => Date.parse(value.endDate) > Date.parse(value.startDate), {
    message: 'End date must be after start date',
    path: ['endDate'],
  });

export const OnboardVendorSchema = z.object({
  organizationName: z.string().trim().min(2).max(160),
  ownerEmail: z.string().email(),
  businessType: z.string().trim().min(2).max(80),
  region: z.string().trim().min(2).max(120),
});

export const SetAvailabilitySchema = z.object({
  listingId: z.string().trim().min(3).max(120),
  date: z.string().date(),
  availableUnits: z.number().int().min(0).max(1000),
  channel: z.string().trim().min(2).max(80),
});

export const PricingSignalSchema = z.object({
  listingId: z.string().trim().min(3).max(120),
  baseRate: z.number().int().min(100),
  occupancyPercent: z.number().min(0).max(100),
  demandSignal: z.enum(['low', 'normal', 'high', 'festival', 'sold_out_nearby']),
});

export const AssignTaskSchema = z.object({
  organizationId: z.string().trim().min(3).max(120),
  title: z.string().trim().min(2).max(160),
  assigneeRole: z.string().trim().min(2).max(80),
});

export const AdventureSlotSchema = z.object({
  trekName: z.string().trim().min(2).max(160),
  capacity: z.number().int().min(1).max(100),
  guideId: z.string().trim().min(3).max(120),
  requiresWaiver: z.boolean(),
});

export const RideDispatchSchema = z.object({
  pickup: z.string().trim().min(2).max(160),
  drop: z.string().trim().min(2).max(160),
  certifiedOnly: z.boolean().default(true),
});

export const TrustSafetyEvaluationSchema = z.object({
  verifiedDocuments: z.number().int().min(0).max(20),
  incidentCount: z.number().int().min(0).max(100),
  womenSafeCertified: z.boolean().default(false),
});

export const CreateNotificationSchema = z.object({
  userId: z.string().trim().min(3).max(120),
  template: z.string().trim().min(2).max(120),
  channels: z.array(z.enum(['whatsapp', 'email', 'sms', 'push', 'in_app'])).min(1).max(5),
});

export const CaptureLeadSchema = z.object({
  travelerPhone: z.string().trim().min(8).max(20),
  source: z.string().trim().min(2).max(80),
  interest: z.string().trim().min(2).max(200),
});

export const WhatsappIntentSchema = z.object({
  from: z.string().trim().min(8).max(20),
  text: z.string().trim().min(2).max(1000),
});
