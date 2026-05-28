import { Body, Controller, Post } from '@nestjs/common';
import { apiResponse } from '../../common/http/api-response';
import { TrustSafetyService } from './trust-safety.service';

@Controller('trust-safety')
export class TrustSafetyController {
  constructor(private readonly trustSafetyService: TrustSafetyService) {}

  @Post('evaluations/provider')
  async evaluateProvider(@Body() body: unknown) {
    return apiResponse(await this.trustSafetyService.evaluateProvider(body));
  }
}
