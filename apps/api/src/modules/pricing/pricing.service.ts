import { Injectable } from '@nestjs/common';
import { PricingSignalSchema } from '../../../../../packages/validators/src/index';

const demandMultipliers = {
  low: 0.9,
  normal: 1,
  high: 1.15,
  festival: 1.35,
  sold_out_nearby: 1.25,
} as const;

@Injectable()
export class PricingService {
  async suggestRate(input: unknown) {
    const parsed = PricingSignalSchema.parse(input);
    const occupancyMultiplier = parsed.occupancyPercent >= 90 ? 1.18 : parsed.occupancyPercent >= 75 ? 1.1 : 1;
    const demandMultiplier = demandMultipliers[parsed.demandSignal];
    const recommendedRate = Math.round(parsed.baseRate * occupancyMultiplier * demandMultiplier);

    return {
      listingId: parsed.listingId,
      baseRate: parsed.baseRate,
      recommendedRate,
      currency: 'INR',
      signals: [parsed.demandSignal, `occupancy_${Math.round(parsed.occupancyPercent)}`],
      explanation: 'Rate optimized from occupancy, demand signal, and direct-booking margin.',
    };
  }
}
