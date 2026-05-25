import { Body, Controller, Param, Post } from '@nestjs/common';
import { apiResponse } from '../../common/http/api-response';
import { InventoryService } from './inventory.service';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post('availability')
  async setAvailability(@Body() body: unknown) {
    return apiResponse(await this.inventoryService.setAvailability(body));
  }

  @Post(':id/reservations')
  async reserveInventory(@Param('id') id: string, @Body('units') units: number) {
    return apiResponse(await this.inventoryService.reserveInventory(id, units));
  }
}
