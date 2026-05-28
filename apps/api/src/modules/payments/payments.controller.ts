import { Body, Controller, Param, Post } from '@nestjs/common';
import { apiResponse } from '../../common/http/api-response';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('orders')
  async createOrder(@Body() body: unknown) {
    return apiResponse(await this.paymentsService.createOrder(body));
  }

  @Post(':id/capture')
  async capturePayment(@Param('id') id: string, @Body() body: unknown) {
    return apiResponse(await this.paymentsService.capturePayment(id, body));
  }

  @Post(':id/settlement-release')
  async releaseSettlement(@Param('id') id: string, @Body() body: unknown) {
    return apiResponse(await this.paymentsService.releaseSettlement(id, body));
  }
}
