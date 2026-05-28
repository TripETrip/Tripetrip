import { describe, expect, it } from 'vitest';
import { BookingStatuses } from '../../packages/constants/src/index';
import { BookingsService } from '../../apps/api/src/modules/bookings/bookings.service';

const bookingRequest = {
  listingId: '11111111-1111-4111-8111-111111111111',
  startDate: '2026-06-10T00:00:00.000Z',
  endDate: '2026-06-12T00:00:00.000Z',
  guestCount: 2,
  specialRequests: 'Need a quiet room.',
};

describe('Booking lifecycle foundation', () => {
  it('creates bookings with an inventory lock and creation event', async () => {
    const service = new BookingsService();
    const booking = await service.createBooking(bookingRequest);

    expect(booking.status).toBe(BookingStatuses.inventoryLocked);
    expect(booking.inventoryLock.expiresAt).toBeTruthy();
    expect(booking.events.map((event) => event.type)).toEqual(['booking.created', 'inventory.locked']);
  });

  it('rejects invalid booking payloads before locking inventory', async () => {
    const service = new BookingsService();

    await expect(
      service.createBooking({
        ...bookingRequest,
        guestCount: 0,
      }),
    ).rejects.toThrow('Number must be greater than or equal to 1');
  });

  it('allows valid payment transition into escrowed state', async () => {
    const service = new BookingsService();
    const booking = await service.createBooking(bookingRequest);
    const pendingPayment = await service.transition(booking.id, BookingStatuses.pendingPayment);
    const escrowed = await service.transition(pendingPayment.id, BookingStatuses.escrowed);

    expect(escrowed.status).toBe(BookingStatuses.escrowed);
    expect(escrowed.events.map((event) => event.type)).toContain('booking.payment_escrowed');
  });

  it('blocks illegal lifecycle jumps', async () => {
    const service = new BookingsService();
    const booking = await service.createBooking(bookingRequest);

    await expect(service.transition(booking.id, BookingStatuses.settled)).rejects.toThrow(
      'Invalid booking transition',
    );
  });
});
