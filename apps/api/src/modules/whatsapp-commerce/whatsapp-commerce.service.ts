import { Injectable } from '@nestjs/common';
import { WhatsappIntentSchema } from '../../../../../packages/validators/src/index';

@Injectable()
export class WhatsappCommerceService {
  async parseBookingIntent(input: unknown) {
    const parsed = WhatsappIntentSchema.parse(input);
    const text = parsed.text.toLowerCase();
    const destination = /in\s+([a-z\s]+?)(?:\s+for|\s*$)/i.exec(parsed.text)?.[1]?.trim();
    const people = /for\s+(\d+)\s+(?:people|persons|travellers|travelers)/i.exec(parsed.text)?.[1];

    return {
      from: parsed.from,
      intent: text.includes('book') ? 'booking_request' : 'support_request',
      confidence: text.includes('book') ? 0.91 : 0.68,
      extractedEntities: {
        destination: destination ? destination.replace(/\b\w/g, (letter) => letter.toUpperCase()) : undefined,
        travelerCount: people ? Number(people) : undefined,
      },
      nextAction: text.includes('book') ? 'create_booking_draft' : 'route_to_support',
    };
  }
}
