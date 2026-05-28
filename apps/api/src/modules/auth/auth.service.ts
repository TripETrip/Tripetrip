import { Injectable } from '@nestjs/common';
import { Roles } from '../../../../../packages/constants/src/index';
import { RegisterProviderSchema, RegisterTravelerSchema } from '../../../../../packages/validators/src/index';

interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: string;
}

interface AuthOrganization {
  id: string;
  name: string;
  slug: string;
  businessType: string;
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function stableId(prefix: string, value: string) {
  return `${prefix}_${slugify(value)}`;
}

@Injectable()
export class AuthService {
  async registerTraveler(input: unknown): Promise<{ user: AuthUser; organization: null }> {
    const parsed = RegisterTravelerSchema.safeParse(input);
    if (!parsed.success) {
      throw new Error(parsed.error.issues[0]?.message || 'Invalid traveler registration payload');
    }

    return {
      user: {
        id: stableId('usr', parsed.data.email),
        email: parsed.data.email,
        fullName: parsed.data.fullName,
        phone: parsed.data.phone,
        role: Roles.traveler,
      },
      organization: null,
    };
  }

  async registerProvider(input: unknown): Promise<{ user: AuthUser; organization: AuthOrganization }> {
    const parsed = RegisterProviderSchema.safeParse(input);
    if (!parsed.success) {
      throw new Error(parsed.error.issues[0]?.message || 'Invalid provider registration payload');
    }

    const organizationSlug = slugify(parsed.data.businessName);

    return {
      user: {
        id: stableId('usr', parsed.data.email),
        email: parsed.data.email,
        fullName: parsed.data.ownerName,
        phone: parsed.data.phone,
        role: Roles.providerOwner,
      },
      organization: {
        id: stableId('org', parsed.data.businessName),
        name: parsed.data.businessName,
        slug: organizationSlug,
        businessType: parsed.data.businessType,
      },
    };
  }
}
