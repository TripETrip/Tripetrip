import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiItineraryService } from './ai-itinerary.service';

@Module({
  controllers: [AiController],
  providers: [AiItineraryService],
  exports: [AiItineraryService],
})
export class AiModule {}
