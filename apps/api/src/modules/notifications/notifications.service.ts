import { Injectable } from '@nestjs/common';
import { CreateNotificationSchema } from '../../../../../packages/validators/src/index';
import { stableId } from '../../common/domain/ids';

@Injectable()
export class NotificationsService {
  async createNotification(input: unknown) {
    const parsed = CreateNotificationSchema.parse(input);
    const id = stableId('notification', `${parsed.userId}-${parsed.template}-${Date.now()}`);

    return {
      id,
      userId: parsed.userId,
      template: parsed.template,
      status: 'queued',
      deliveries: parsed.channels.map((channel) => ({
        id: stableId('delivery', `${id}-${channel}`),
        channel,
        status: 'pending',
        retryCount: 0,
      })),
    };
  }
}
