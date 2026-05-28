import { Body, Controller, Post } from '@nestjs/common';
import { apiResponse } from '../../common/http/api-response';
import { WhatsappCommerceService } from './whatsapp-commerce.service';

@Controller('whatsapp-commerce')
export class WhatsappCommerceController {
  constructor(private readonly whatsappCommerceService: WhatsappCommerceService) {}

  @Post('intents')
  async parseBookingIntent(@Body() body: unknown) {
    return apiResponse(await this.whatsappCommerceService.parseBookingIntent(body));
  }
}
