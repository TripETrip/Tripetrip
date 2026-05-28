import { Injectable } from '@nestjs/common';
import { OnboardVendorSchema } from '../../../../../packages/validators/src/index';
import { slugify, stableId } from '../../common/domain/ids';

@Injectable()
export class VendorsService {
  async onboardVendor(input: unknown) {
    const parsed = OnboardVendorSchema.parse(input);
    const slug = slugify(parsed.organizationName);

    return {
      id: stableId('vendor', parsed.organizationName),
      organizationName: parsed.organizationName,
      ownerEmail: parsed.ownerEmail,
      businessType: parsed.businessType,
      region: parsed.region,
      kycStatus: 'pending_review',
      storefrontUrl: `/provider/${slug}`,
      enabledModules: [
        'direct_url_studio',
        'booking_command_center',
        'lead_inbox',
        'smart_price_calendar',
        'payout_tracker',
        'growth_signal_board',
      ],
    };
  }
}
