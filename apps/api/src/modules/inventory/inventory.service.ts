import { Injectable } from '@nestjs/common';
import { SetAvailabilitySchema } from '../../../../../packages/validators/src/index';
import { stableId } from '../../common/domain/ids';

interface InventoryRecord {
  id: string;
  listingId: string;
  date: string;
  availableUnits: number;
  reservedUnits: number;
  channel: string;
  syncStatus: string;
}

@Injectable()
export class InventoryService {
  private readonly inventory = new Map<string, InventoryRecord>();

  async setAvailability(input: unknown): Promise<InventoryRecord> {
    const parsed = SetAvailabilitySchema.parse(input);
    const id = stableId('inventory', `${parsed.listingId}-${parsed.date}-${parsed.channel}`);
    const record: InventoryRecord = {
      id,
      listingId: parsed.listingId,
      date: parsed.date,
      availableUnits: parsed.availableUnits,
      reservedUnits: 0,
      channel: parsed.channel,
      syncStatus: 'ready_for_channel_sync',
    };
    this.inventory.set(id, record);
    return record;
  }

  async reserveInventory(id: string, units: number): Promise<InventoryRecord> {
    const record = this.inventory.get(id);
    if (!record) {
      throw new Error('Inventory record not found');
    }
    if (units < 1) {
      throw new Error('Reservation units must be greater than zero');
    }
    if (record.reservedUnits + units > record.availableUnits) {
      throw new Error('Insufficient inventory');
    }

    record.reservedUnits += units;
    this.inventory.set(id, record);
    return record;
  }
}
