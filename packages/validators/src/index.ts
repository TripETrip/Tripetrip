import { z } from 'zod';

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
