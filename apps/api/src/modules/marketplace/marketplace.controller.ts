import { Controller, Get, Param, Query } from '@nestjs/common';
import { apiResponse } from '../../common/http/api-response';
import { MarketplaceService } from './marketplace.service';

@Controller('marketplace')
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Get('listings')
  async listListings(@Query() query: Record<string, string>) {
    return apiResponse(await this.marketplaceService.listListings(query));
  }

  @Get('providers/:slug')
  async getProvider(@Param('slug') slug: string) {
    return apiResponse(await this.marketplaceService.getProviderStorefront(slug));
  }
}
