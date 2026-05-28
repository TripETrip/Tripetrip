import { Controller, Get } from '@nestjs/common';
import { apiResponse } from '../../common/http/api-response';

@Controller('health')
export class HealthController {
  @Get()
  health() {
    return apiResponse({
      status: 'ok',
      service: 'tripetrip-api',
    });
  }
}
