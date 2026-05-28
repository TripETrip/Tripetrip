import { Controller, Get, Query } from '@nestjs/common';
import { apiResponse } from '../../common/http/api-response';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async matchIntent(@Query('q') q = '') {
    return apiResponse(await this.searchService.matchIntent(q));
  }
}
