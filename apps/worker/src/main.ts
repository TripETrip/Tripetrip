import { EventTopics } from '../../../packages/constants/src/index';
import { handleBookingEvent } from './consumers/booking-events.consumer';
import { handleNotificationEvent } from './consumers/notification-events.consumer';
import { handlePaymentEvent } from './consumers/payment-events.consumer';
import { handleSearchIndexingEvent } from './consumers/search-indexing.consumer';

export const workerSubscriptions = [
  { topic: EventTopics.booking, handler: handleBookingEvent },
  { topic: EventTopics.payment, handler: handlePaymentEvent },
  { topic: EventTopics.searchIndexing, handler: handleSearchIndexingEvent },
  { topic: EventTopics.notification, handler: handleNotificationEvent },
];

export async function startWorker() {
  return {
    service: 'tripetrip-worker',
    subscriptions: workerSubscriptions.map((subscription) => subscription.topic),
  };
}

void startWorker();
