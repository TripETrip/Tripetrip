import { Injectable } from '@nestjs/common';

@Injectable()
export class SearchService {
  async matchIntent(query: string) {
    return {
      query,
      semanticSearch: true,
      filters: ['budget', 'family', 'women_safe', 'nearby'],
      ranking: ['verified_supply', 'direct_rate', 'local_relevance'],
    };
  }
}
