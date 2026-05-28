import { Injectable } from '@nestjs/common';
import { AdventureSlotSchema } from '../../../../../packages/validators/src/index';
import { stableId } from '../../common/domain/ids';

@Injectable()
export class AdventureService {
  async createSlot(input: unknown) {
    const parsed = AdventureSlotSchema.parse(input);
    const safetyChecks = ['guide_assigned', 'equipment_manifest_required'];
    if (parsed.requiresWaiver) {
      safetyChecks.push('waiver_required');
    }

    return {
      id: stableId('adventure_slot', `${parsed.trekName}-${parsed.guideId}`),
      trekName: parsed.trekName,
      capacity: parsed.capacity,
      guideId: parsed.guideId,
      status: 'open',
      safetyChecks,
    };
  }
}
