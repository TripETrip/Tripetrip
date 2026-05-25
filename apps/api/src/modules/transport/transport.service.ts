import { Injectable } from '@nestjs/common';
import { RideDispatchSchema } from '../../../../../packages/validators/src/index';
import { stableId } from '../../common/domain/ids';

@Injectable()
export class TransportService {
  async dispatchRide(input: unknown) {
    const parsed = RideDispatchSchema.parse(input);

    return {
      id: stableId('ride', `${parsed.pickup}-${parsed.drop}`),
      pickup: parsed.pickup,
      drop: parsed.drop,
      vehicleType: 'certified_local_taxi',
      certified: parsed.certifiedOnly,
      zeroCommission: true,
      dispatchStatus: 'assigned',
      routeOptimization: 'enabled',
    };
  }
}
