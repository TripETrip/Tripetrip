import { Body, Controller, Post } from '@nestjs/common';
import { apiResponse } from '../../common/http/api-response';
import { AiItineraryService } from './ai-itinerary.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiItineraryService: AiItineraryService) {}

  @Post('itineraries')
  async generateItinerary(@Body() body: unknown) {
    return apiResponse(await this.aiItineraryService.generateBlueprint(body));
  }
}
