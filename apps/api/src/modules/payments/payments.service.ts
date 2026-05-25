import { Injectable } from '@nestjs/common';
import {
  LedgerEntryTypes,
  PaymentEventTypes,
  PaymentProviders,
  PaymentStatuses,
} from '../../../../../packages/constants/src/index';
import {
  CapturePaymentSchema,
  CreatePaymentOrderSchema,
  ReleaseSettlementSchema,
} from '../../../../../packages/validators/src/index';

type PaymentProvider = (typeof PaymentProviders)[keyof typeof PaymentProviders];
type PaymentStatus = (typeof PaymentStatuses)[keyof typeof PaymentStatuses];
type LedgerEntryType = (typeof LedgerEntryTypes)[keyof typeof LedgerEntryTypes];

interface PaymentAuditEvent {
  type: string;
  at: string;
  metadata?: Record<string, unknown>;
}

interface LedgerEntry {
  id: string;
  type: LedgerEntryType;
  amount: number;
  currency: string;
  at: string;
  walletId?: string;
}

interface PaymentOrder {
  id: string;
  bookingId: string;
  travelerId: string;
  providerId: string;
  gatewayOrderId: string;
  amount: number;
  currency: string;
  provider: PaymentProvider;
  status: PaymentStatus;
  gatewayPaymentId?: string;
  vendorWalletId?: string;
  ledgerEntries: LedgerEntry[];
  auditEvents: PaymentAuditEvent[];
}

function nowIso() {
  return new Date().toISOString();
}

function createId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

@Injectable()
export class PaymentsService {
  private readonly orders = new Map<string, PaymentOrder>();

  async createOrder(input: unknown): Promise<PaymentOrder> {
    const parsed = CreatePaymentOrderSchema.parse(input);
    const order: PaymentOrder = {
      id: createId('payment'),
      bookingId: parsed.bookingId,
      travelerId: parsed.travelerId,
      providerId: parsed.providerId,
      gatewayOrderId: createId('order'),
      amount: parsed.amount,
      currency: parsed.currency,
      provider: parsed.provider,
      status: PaymentStatuses.orderCreated,
      ledgerEntries: [],
      auditEvents: [{ type: PaymentEventTypes.orderCreated, at: nowIso(), metadata: { provider: parsed.provider } }],
    };

    this.orders.set(order.id, order);
    return order;
  }

  async capturePayment(id: string, input: unknown): Promise<PaymentOrder> {
    const parsed = CapturePaymentSchema.parse(input);
    const order = this.getOrder(id);
    if (order.status !== PaymentStatuses.orderCreated) {
      throw new Error(`Payment cannot be captured from status ${order.status}`);
    }

    order.status = PaymentStatuses.escrowed;
    order.gatewayPaymentId = parsed.gatewayPaymentId;
    order.ledgerEntries.push(
      this.createLedgerEntry(LedgerEntryTypes.travelerDebit, order.amount, order.currency),
      this.createLedgerEntry(LedgerEntryTypes.escrowCredit, order.amount, order.currency),
    );
    order.auditEvents.push({
      type: PaymentEventTypes.capturedToEscrow,
      at: nowIso(),
      metadata: { gatewayPaymentId: parsed.gatewayPaymentId },
    });
    this.orders.set(id, order);
    return order;
  }

  async releaseSettlement(id: string, input: unknown): Promise<PaymentOrder> {
    const parsed = ReleaseSettlementSchema.parse(input);
    const order = this.getOrder(id);
    if (order.status !== PaymentStatuses.escrowed && order.status !== PaymentStatuses.settlementPending) {
      throw new Error(`Settlement cannot be released from status ${order.status}`);
    }
    if (!parsed.checkInValidated) {
      throw new Error('Check-in validation is required before settlement');
    }
    if (order.ledgerEntries.some((entry) => entry.type === LedgerEntryTypes.vendorWalletCredit)) {
      throw new Error('Settlement has already been released');
    }

    order.status = PaymentStatuses.settled;
    order.vendorWalletId = parsed.vendorWalletId;
    order.ledgerEntries.push(
      this.createLedgerEntry(LedgerEntryTypes.escrowDebit, order.amount, order.currency),
      this.createLedgerEntry(LedgerEntryTypes.vendorWalletCredit, order.amount, order.currency, parsed.vendorWalletId),
    );
    order.auditEvents.push({
      type: PaymentEventTypes.settlementReleased,
      at: nowIso(),
      metadata: { vendorWalletId: parsed.vendorWalletId },
    });
    this.orders.set(id, order);
    return order;
  }

  private getOrder(id: string): PaymentOrder {
    const order = this.orders.get(id);
    if (!order) {
      throw new Error('Payment order not found');
    }
    return order;
  }

  private createLedgerEntry(type: LedgerEntryType, amount: number, currency: string, walletId?: string): LedgerEntry {
    return {
      id: createId('ledger'),
      type,
      amount,
      currency,
      at: nowIso(),
      walletId,
    };
  }
}
