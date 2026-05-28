import { Injectable } from '@nestjs/common';
import { CaptureLeadSchema } from '../../../../../packages/validators/src/index';
import { stableId } from '../../common/domain/ids';

@Injectable()
export class CrmService {
  async captureLead(input: unknown) {
    const parsed = CaptureLeadSchema.parse(input);
    const highIntentWords = ['book', 'family', 'homestay', 'trek', 'taxi'];
    const score = Math.min(
      100,
      50 + highIntentWords.filter((word) => parsed.interest.toLowerCase().includes(word)).length * 10,
    );

    return {
      id: stableId('lead', `${parsed.travelerPhone}-${parsed.interest}`),
      travelerPhone: parsed.travelerPhone,
      source: parsed.source,
      interest: parsed.interest,
      score,
      nextAction: score >= 70 ? 'priority_follow_up' : 'nurture_sequence',
    };
  }
}
