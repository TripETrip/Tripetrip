import { describe, expect, it } from 'vitest';
import { ApiRoutes } from '../../packages/api-contracts/src/index';
import { AiItineraryService } from '../../apps/api/src/modules/ai/ai-itinerary.service';

const itineraryRequest = {
  destination: 'Tawang',
  startDate: '2026-10-04T00:00:00.000Z',
  endDate: '2026-10-08T00:00:00.000Z',
  travelerCount: 3,
  budget: 65000,
  interests: ['monastery', 'trekking', 'local food'],
};

describe('AI itinerary concierge foundation', () => {
  it('exposes a backend-only API route contract for AI orchestration', () => {
    expect(ApiRoutes.ai).toBe('/ai');
  });

  it('generates synchronized stays, activities, and verified taxis in one blueprint', async () => {
    const service = new AiItineraryService();
    const blueprint = await service.generateBlueprint(itineraryRequest);

    expect(blueprint.destination).toBe('Tawang');
    expect(blueprint.generatedInMs).toBeLessThan(30_000);
    expect(blueprint.stays.length).toBeGreaterThan(0);
    expect(blueprint.activities.length).toBeGreaterThan(0);
    expect(blueprint.taxis.length).toBeGreaterThan(0);
    expect(blueprint.taxis.every((taxi) => taxi.certified)).toBe(true);
  });

  it('aligns every suggested activity with a day and commute option', async () => {
    const service = new AiItineraryService();
    const blueprint = await service.generateBlueprint(itineraryRequest);

    for (const activity of blueprint.activities) {
      expect(activity.day).toBeGreaterThanOrEqual(1);
      expect(activity.taxiDispatchId).toMatch(/^taxi_/);
    }
  });

  it('rejects impossible itinerary requests before orchestration', async () => {
    const service = new AiItineraryService();

    await expect(
      service.generateBlueprint({
        ...itineraryRequest,
        travelerCount: 0,
      }),
    ).rejects.toThrow('Number must be greater than or equal to 1');
  });
});
