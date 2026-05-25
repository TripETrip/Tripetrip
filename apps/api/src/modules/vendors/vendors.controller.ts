import { Body, Controller, Post } from '@nestjs/common';
import { apiResponse } from '../../common/http/api-response';
import { VendorsService } from './vendors.service';

@Controller('vendors')
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @Post('onboarding')
  async onboardVendor(@Body() body: unknown) {
    return apiResponse(await this.vendorsService.onboardVendor(body));
  }
}
