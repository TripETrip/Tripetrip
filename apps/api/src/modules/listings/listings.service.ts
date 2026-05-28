import { Injectable } from '@nestjs/common';
import { stableId } from '../../common/domain/ids';

@Injectable()
export class ListingsService {
  async generateListingDraft(input: { title: string; category: string; location: string }) {
    return {
      id: stableId('listing', `${input.title}-${input.location}`),
      title: input.title,
      category: input.category,
      location: input.location,
      status: 'draft',
      seoTitle: `${input.title} in ${input.location} | TripETrip`,
      mediaPolicy: 'cloudinary_required',
      aiAssisted: true,
    };
  }
}
