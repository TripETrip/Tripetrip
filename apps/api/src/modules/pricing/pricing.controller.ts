import { Body, Controller, Post } from '@nestjs/common';
import { apiResponse } from '../../common/http/api-response';
import { PricingService } from './pricing.service';

@Controller('pricing')
export class PricingController {
  constructor(private readonly pricingService: PricingService) {}

  @Post('recommendations')
  async suggestRate(@Body() body: unknown) {
    return apiResponse(await this.pricingService.suggestRate(body));
  }
}
