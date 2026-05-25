import { Module } from '@nestjs/common';
import { WhatsappCommerceController } from './whatsapp-commerce.controller';
import { WhatsappCommerceService } from './whatsapp-commerce.service';

@Module({
  controllers: [WhatsappCommerceController],
  providers: [WhatsappCommerceService],
  exports: [WhatsappCommerceService],
})
export class WhatsappCommerceModule {}
