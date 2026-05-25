import { Module } from '@nestjs/common';
import { AdminModule } from './modules/admin/admin.module';
import { AuthModule } from './modules/auth/auth.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { HealthController } from './modules/health/health.controller';
import { MarketplaceModule } from './modules/marketplace/marketplace.module';
import { PaymentsModule } from './modules/payments/payments.module';

@Module({
  imports: [AuthModule, MarketplaceModule, BookingsModule, PaymentsModule, AdminModule],
  controllers: [HealthController],
})
export class AppModule {}
