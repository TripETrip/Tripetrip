import { describe, expect, it } from 'vitest';
import { PaymentProviders, PaymentStatuses } from '../../packages/constants/src/index';
import { PaymentsService } from '../../apps/api/src/modules/payments/payments.service';

const orderRequest = {
  bookingId: '22222222-2222-4222-8222-222222222222',
  travelerId: '33333333-3333-4333-8333-333333333333',
  providerId: '44444444-4444-4444-8444-444444444444',
  amount: 12000,
  currency: 'INR',
  provider: PaymentProviders.razorpay,
};

describe('Payment escrow and settlement foundation', () => {
  it('creates a Razorpay-compatible order with payment audit event', async () => {
    const service = new PaymentsService();
    const order = await service.createOrder(orderRequest);

    expect(order.status).toBe(PaymentStatuses.orderCreated);
    expect(order.gatewayOrderId).toMatch(/^order_/);
    expect(order.auditEvents.map((event) => event.type)).toEqual(['payment.order_created']);
  });

  it('captures traveler funds into escrow before vendor settlement', async () => {
    const service = new PaymentsService();
    const order = await service.createOrder(orderRequest);
    const escrowed = await service.capturePayment(order.id, {
      gatewayPaymentId: 'pay_live_123',
      gatewaySignature: 'signed_payload',
    });

    expect(escrowed.status).toBe(PaymentStatuses.escrowed);
    expect(escrowed.ledgerEntries.map((entry) => entry.type)).toEqual(['traveler_debit', 'escrow_credit']);
  });

  it('releases vendor settlement only after check-in validation', async () => {
    const service = new PaymentsService();
    const order = await service.createOrder(orderRequest);
    await service.capturePayment(order.id, {
      gatewayPaymentId: 'pay_live_123',
      gatewaySignature: 'signed_payload',
    });
    const settled = await service.releaseSettlement(order.id, {
      checkInValidated: true,
      vendorWalletId: 'wallet_provider_001',
    });

    expect(settled.status).toBe(PaymentStatuses.settled);
    expect(settled.ledgerEntries.map((entry) => entry.type)).toContain('vendor_wallet_credit');
    expect(settled.auditEvents.map((event) => event.type)).toContain('payment.settlement_released');
  });

  it('blocks settlement release before check-in validation', async () => {
    const service = new PaymentsService();
    const order = await service.createOrder(orderRequest);
    await service.capturePayment(order.id, {
      gatewayPaymentId: 'pay_live_123',
      gatewaySignature: 'signed_payload',
    });

    await expect(
      service.releaseSettlement(order.id, {
        checkInValidated: false,
        vendorWalletId: 'wallet_provider_001',
      }),
    ).rejects.toThrow('Check-in validation is required before settlement');
  });
});
