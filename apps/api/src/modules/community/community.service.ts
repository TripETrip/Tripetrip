import { Injectable } from '@nestjs/common';
import { stableId } from '../../common/domain/ids';

@Injectable()
export class CommunityService {
  async publishReview(input: { bookingId: string; rating: number; body: string }) {
    if (input.rating < 1 || input.rating > 5) {
      throw new Error('Review rating must be between 1 and 5');
    }

    return {
      id: stableId('review', input.bookingId),
      bookingId: input.bookingId,
      rating: input.rating,
      body: input.body,
      verification: 'booking_verified',
      moderationStatus: 'pending_ai_review',
    };
  }
}
