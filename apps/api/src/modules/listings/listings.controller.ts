import { Body, Controller, Post } from '@nestjs/common';
import { apiResponse } from '../../common/http/api-response';
import { ListingsService } from './listings.service';

@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Post('drafts')
  async generateListingDraft(@Body() body: { title: string; category: string; location: string }) {
    return apiResponse(await this.listingsService.generateListingDraft(body));
  }
}
