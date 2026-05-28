import { Module } from '@nestjs/common';
import { AdminModule } from './modules/admin/admin.module';
import { AdventureModule } from './modules/adventure/adventure.module';
import { AiModule } from './modules/ai/ai.module';
import { AuthModule } from './modules/auth/auth.module';
import { AuditModule } from './modules/audit/audit.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { CommunityModule } from './modules/community/community.module';
import { CrmModule } from './modules/crm/crm.module';
import { HealthController } from './modules/health/health.controller';
import { InventoryModule } from './modules/inventory/inventory.module';
import { ListingsModule } from './modules/listings/listings.module';
import { MarketplaceModule } from './modules/marketplace/marketplace.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { OperationsModule } from './modules/operations/operations.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { PricingModule } from './modules/pricing/pricing.module';
import { SearchModule } from './modules/search/search.module';
import { TransportModule } from './modules/transport/transport.module';
import { TrustSafetyModule } from './modules/trust-safety/trust-safety.module';
import { UsersModule } from './modules/users/users.module';
import { VendorsModule } from './modules/vendors/vendors.module';
import { WhatsappCommerceModule } from './modules/whatsapp-commerce/whatsapp-commerce.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    VendorsModule,
    ListingsModule,
    SearchModule,
    MarketplaceModule,
    InventoryModule,
    PricingModule,
    BookingsModule,
    PaymentsModule,
    CrmModule,
    OperationsModule,
    AiModule,
    CommunityModule,
    TrustSafetyModule,
    AdventureModule,
    TransportModule,
    WhatsappCommerceModule,
    NotificationsModule,
    AuditModule,
    AdminModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
