import { Injectable } from '@nestjs/common';
import { BookingEventTypes, BookingStatuses } from '../../../../../packages/constants/src/index';
import { CreateBookingSchema } from '../../../../../packages/validators/src/index';

type BookingStatus = (typeof BookingStatuses)[keyof typeof BookingStatuses];

interface BookingEvent {
  type: string;
  at: string;
  metadata?: Record<string, unknown>;
}

interface BookingRecord {
  id: string;
  listingId: string;
  status: BookingStatus;
  guestCount: number;
  startDate: string;
  endDate?: string;
  specialRequests?: string;
  inventoryLock: {
    id: string;
    expiresAt: string;
  };
  events: BookingEvent[];
}

const transitionEvents: Partial<Record<BookingStatus, string>> = {
  [BookingStatuses.pendingPayment]: BookingEventTypes.pendingPayment,
  [BookingStatuses.escrowed]: BookingEventTypes.paymentEscrowed,
  [BookingStatuses.confirmed]: BookingEventTypes.confirmed,
  [BookingStatuses.checkedIn]: BookingEventTypes.checkedIn,
  [BookingStatuses.settlementPending]: BookingEventTypes.settlementPending,
  [BookingStatuses.settled]: BookingEventTypes.settled,
  [BookingStatuses.completed]: BookingEventTypes.completed,
};

const allowedTransitions: Partial<Record<BookingStatus, BookingStatus[]>> = {
  [BookingStatuses.inventoryLocked]: [BookingStatuses.pendingPayment, BookingStatuses.expired],
  [BookingStatuses.pendingPayment]: [BookingStatuses.escrowed, BookingStatuses.failed],
  [BookingStatuses.escrowed]: [BookingStatuses.confirmed, BookingStatuses.cancellationRequested],
  [BookingStatuses.confirmed]: [BookingStatuses.checkedIn],
  [BookingStatuses.checkedIn]: [BookingStatuses.settlementPending],
  [BookingStatuses.settlementPending]: [BookingStatuses.settled],
  [BookingStatuses.settled]: [BookingStatuses.completed],
  [BookingStatuses.cancellationRequested]: [BookingStatuses.refundPending],
  [BookingStatuses.refundPending]: [BookingStatuses.refunded],
};

function nowIso() {
  return new Date().toISOString();
}

function createId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

@Injectable()
export class BookingsService {
  private readonly bookings = new Map<string, BookingRecord>();

  async createBooking(input: unknown): Promise<BookingRecord> {
    const parsed = CreateBookingSchema.parse(input);
    const id = createId('booking');
    const lockExpiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    const booking: BookingRecord = {
      id,
      listingId: parsed.listingId,
      status: BookingStatuses.inventoryLocked,
      guestCount: parsed.guestCount,
      startDate: parsed.startDate,
      endDate: parsed.endDate,
      specialRequests: parsed.specialRequests,
      inventoryLock: {
        id: createId('lock'),
        expiresAt: lockExpiresAt,
      },
      events: [
        { type: BookingEventTypes.created, at: nowIso() },
        { type: BookingEventTypes.inventoryLocked, at: nowIso(), metadata: { expiresAt: lockExpiresAt } },
      ],
    };

    this.bookings.set(id, booking);
    return booking;
  }

  async transition(id: string, nextStatus: BookingStatus): Promise<BookingRecord> {
    const booking = this.bookings.get(id);
    if (!booking) {
      throw new Error('Booking not found');
    }

    const allowed = allowedTransitions[booking.status] || [];
    if (!allowed.includes(nextStatus)) {
      throw new Error(`Invalid booking transition: ${booking.status} -> ${nextStatus}`);
    }

    booking.status = nextStatus;
    const eventType = transitionEvents[nextStatus];
    if (eventType) {
      booking.events.push({ type: eventType, at: nowIso() });
    }
    this.bookings.set(id, booking);
    return booking;
  }
}
