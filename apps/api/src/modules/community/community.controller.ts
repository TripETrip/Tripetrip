import { Body, Controller, Post } from '@nestjs/common';
import { apiResponse } from '../../common/http/api-response';
import { CommunityService } from './community.service';

@Controller('community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @Post('reviews')
  async publishReview(@Body() body: { bookingId: string; rating: number; body: string }) {
    return apiResponse(await this.communityService.publishReview(body));
  }
}
