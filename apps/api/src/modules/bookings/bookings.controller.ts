import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { apiResponse } from '../../common/http/api-response';
import { BookingsService } from './bookings.service';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  async createBooking(@Body() body: unknown) {
    return apiResponse(await this.bookingsService.createBooking(body));
  }

  @Patch(':id/status')
  async transition(@Param('id') id: string, @Body('status') status: never) {
    return apiResponse(await this.bookingsService.transition(id, status));
  }
}
