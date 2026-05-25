import { Body, Controller, Post } from '@nestjs/common';
import { apiResponse } from '../../common/http/api-response';
import { TransportService } from './transport.service';

@Controller('transport')
export class TransportController {
  constructor(private readonly transportService: TransportService) {}

  @Post('dispatch')
  async dispatchRide(@Body() body: unknown) {
    return apiResponse(await this.transportService.dispatchRide(body));
  }
}
