import { Body, Controller, Post } from '@nestjs/common';
import { apiResponse } from '../../common/http/api-response';
import { AdventureService } from './adventure.service';

@Controller('adventure-os')
export class AdventureController {
  constructor(private readonly adventureService: AdventureService) {}

  @Post('slots')
  async createSlot(@Body() body: unknown) {
    return apiResponse(await this.adventureService.createSlot(body));
  }
}
