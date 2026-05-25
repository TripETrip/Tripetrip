import { Injectable } from '@nestjs/common';
import { GenerateItinerarySchema } from '../../../../../packages/validators/src/index';

interface StaySuggestion {
  id: string;
  name: string;
  category: 'homestay' | 'hotel' | 'camp';
  nights: number;
  verified: boolean;
}

interface ActivitySuggestion {
  id: string;
  title: string;
  day: number;
  durationHours: number;
  taxiDispatchId: string;
}

interface TaxiDispatchSuggestion {
  id: string;
  operatorName: string;
  certified: boolean;
  zeroCommission: boolean;
}

interface ItineraryBlueprint {
  destination: string;
  generatedInMs: number;
  stays: StaySuggestion[];
  activities: ActivitySuggestion[];
  taxis: TaxiDispatchSuggestion[];
  safetySignals: string[];
  assumptions: string[];
}

function createId(prefix: string, seed: string) {
  return `${prefix}_${seed.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')}`;
}

function tripDays(startDate: string, endDate: string) {
  const dayMs = 24 * 60 * 60 * 1000;
  return Math.max(1, Math.ceil((Date.parse(endDate) - Date.parse(startDate)) / dayMs));
}

@Injectable()
export class AiItineraryService {
  async generateBlueprint(input: unknown): Promise<ItineraryBlueprint> {
    const startedAt = Date.now();
    const parsed = GenerateItinerarySchema.parse(input);
    const days = tripDays(parsed.startDate, parsed.endDate);
    const primaryTaxiId = createId('taxi', `${parsed.destination}-certified-dispatch`);

    const taxis: TaxiDispatchSuggestion[] = [
      {
        id: primaryTaxiId,
        operatorName: `${parsed.destination} Certified Transit Collective`,
        certified: true,
        zeroCommission: true,
      },
    ];

    const activities = parsed.interests.slice(0, days).map((interest, index) => ({
      id: createId('activity', `${parsed.destination}-${interest}`),
      title: `${interest} experience in ${parsed.destination}`,
      day: index + 1,
      durationHours: interest.toLowerCase().includes('trek') ? 6 : 3,
      taxiDispatchId: primaryTaxiId,
    }));

    return {
      destination: parsed.destination,
      generatedInMs: Date.now() - startedAt,
      stays: [
        {
          id: createId('stay', `${parsed.destination}-verified-homestay`),
          name: `${parsed.destination} Verified Village Homestay`,
          category: 'homestay',
          nights: days,
          verified: true,
        },
      ],
      activities,
      taxis,
      safetySignals: ['verified_provider_supply', 'certified_local_transit', 'weather_review_required'],
      assumptions: [
        `Optimized for ${parsed.travelerCount} traveler(s)`,
        parsed.budget ? `Budget target ${parsed.budget} INR` : 'Budget target not provided',
      ],
    };
  }
}
