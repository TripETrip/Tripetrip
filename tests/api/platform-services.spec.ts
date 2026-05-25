import { describe, expect, it } from 'vitest';
import { AdventureService } from '../../apps/api/src/modules/adventure/adventure.service';
import { CrmService } from '../../apps/api/src/modules/crm/crm.service';
import { InventoryService } from '../../apps/api/src/modules/inventory/inventory.service';
import { NotificationsService } from '../../apps/api/src/modules/notifications/notifications.service';
import { OperationsService } from '../../apps/api/src/modules/operations/operations.service';
import { PricingService } from '../../apps/api/src/modules/pricing/pricing.service';
import { TransportService } from '../../apps/api/src/modules/transport/transport.service';
import { TrustSafetyService } from '../../apps/api/src/modules/trust-safety/trust-safety.service';
import { VendorsService } from '../../apps/api/src/modules/vendors/vendors.service';
import { WhatsappCommerceService } from '../../apps/api/src/modules/whatsapp-commerce/whatsapp-commerce.service';

describe('core Travel OS service foundations', () => {
  it('onboards vendors with KYC, storefront URL, and provider OS modules', async () => {
    const service = new VendorsService();
    const vendor = await service.onboardVendor({
      organizationName: 'Ziro Valley Homestays',
      ownerEmail: 'owner@ziro.example',
      businessType: 'homestay',
      region: 'Arunachal Pradesh',
    });

    expect(vendor.kycStatus).toBe('pending_review');
    expect(vendor.storefrontUrl).toBe('/provider/ziro-valley-homestays');
    expect(vendor.enabledModules).toContain('booking_command_center');
  });

  it('protects inventory from overbooking while exposing channel sync metadata', async () => {
    const service = new InventoryService();
    const inventory = await service.setAvailability({
      listingId: 'listing_homestay_001',
      date: '2026-11-01',
      availableUnits: 2,
      channel: 'direct',
    });

    expect(inventory.syncStatus).toBe('ready_for_channel_sync');
    await expect(service.reserveInventory(inventory.id, 3)).rejects.toThrow('Insufficient inventory');
  });

  it('suggests dynamic pricing from occupancy and demand signals', async () => {
    const service = new PricingService();
    const recommendation = await service.suggestRate({
      listingId: 'listing_homestay_001',
      baseRate: 3000,
      occupancyPercent: 92,
      demandSignal: 'festival',
    });

    expect(recommendation.recommendedRate).toBeGreaterThan(3000);
    expect(recommendation.signals).toContain('festival');
  });

  it('coordinates staff operations, adventure slots, and transport dispatch', async () => {
    const operations = new OperationsService();
    const adventure = new AdventureService();
    const transport = new TransportService();

    const task = await operations.assignTask({
      organizationId: 'org_001',
      title: 'Prepare trek safety kits',
      assigneeRole: 'guide',
    });
    const slot = await adventure.createSlot({
      trekName: 'Dzuko Valley Trail',
      capacity: 8,
      guideId: 'guide_001',
      requiresWaiver: true,
    });
    const ride = await transport.dispatchRide({
      pickup: 'Airport',
      drop: 'Homestay',
      certifiedOnly: true,
    });

    expect(task.status).toBe('assigned');
    expect(slot.safetyChecks).toContain('waiver_required');
    expect(ride.zeroCommission).toBe(true);
  });

  it('scores trust/safety and creates multi-channel notifications', async () => {
    const trustSafety = new TrustSafetyService();
    const notifications = new NotificationsService();

    const score = await trustSafety.evaluateProvider({
      verifiedDocuments: 4,
      incidentCount: 0,
      womenSafeCertified: true,
    });
    const notification = await notifications.createNotification({
      userId: 'usr_001',
      template: 'booking_confirmed',
      channels: ['whatsapp', 'email', 'push'],
    });

    expect(score.badges).toContain('women_safe');
    expect(notification.deliveries).toHaveLength(3);
  });

  it('captures CRM leads and WhatsApp booking intents', async () => {
    const crm = new CrmService();
    const whatsapp = new WhatsappCommerceService();

    const lead = await crm.captureLead({
      travelerPhone: '+919999999999',
      source: 'whatsapp',
      interest: 'Tawang family homestay',
    });
    const intent = await whatsapp.parseBookingIntent({
      from: '+919999999999',
      text: 'Book a homestay in Tawang for 3 people',
    });

    expect(lead.score).toBeGreaterThanOrEqual(70);
    expect(intent.intent).toBe('booking_request');
    expect(intent.extractedEntities.destination).toBe('Tawang');
  });
});
