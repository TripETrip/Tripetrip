import { Injectable } from '@nestjs/common';
import { ListingSearchSchema } from '../../../../../packages/validators/src/index';

interface PublicListing {
  id: string;
  providerSlug: string;
  title: string;
  category: string;
  location: string;
  basePrice: number;
  currency: string;
  trustBadges: string[];
}

interface PublicProvider {
  id: string;
  name: string;
  slug: string;
  organizationType: string;
  trustScore: number;
}

const providers: PublicProvider[] = [
  {
    id: 'org_demo_himalayan_collective',
    name: 'Demo Himalayan Collective',
    slug: 'demo-himalayan-collective',
    organizationType: 'rural_tourism',
    trustScore: 92,
  },
];

const listings: PublicListing[] = [
  {
    id: 'listing_riverside_homestay',
    providerSlug: 'demo-himalayan-collective',
    title: 'Riverside Homestay',
    category: 'homestay',
    location: 'Old Manali',
    basePrice: 2800,
    currency: 'INR',
    trustBadges: ['verified_provider', 'women_safe'],
  },
  {
    id: 'listing_certified_taxi',
    providerSlug: 'demo-himalayan-collective',
    title: 'Certified Manali Taxi',
    category: 'taxi',
    location: 'Manali',
    basePrice: 1800,
    currency: 'INR',
    trustBadges: ['verified_driver', 'zero_commission'],
  },
  {
    id: 'listing_guided_trek',
    providerSlug: 'demo-himalayan-collective',
    title: 'Local Himalayan Trek Captain',
    category: 'trek',
    location: 'Solang Valley',
    basePrice: 3500,
    currency: 'INR',
    trustBadges: ['certified_guide', 'safety_waiver'],
  },
];

@Injectable()
export class MarketplaceService {
  async listListings(input: unknown = {}) {
    const parsed = ListingSearchSchema.parse(input);
    const q = parsed.q?.toLowerCase();
    const category = parsed.category?.toLowerCase();
    const location = parsed.location?.toLowerCase();

    const items = listings.filter((listing) => {
      const matchesCategory = !category || listing.category.toLowerCase() === category;
      const matchesLocation = !location || listing.location.toLowerCase().includes(location);
      const matchesQuery =
        !q ||
        [listing.title, listing.category, listing.location, ...listing.trustBadges]
          .join(' ')
          .toLowerCase()
          .includes(q);
      const matchesMin = parsed.minPrice === undefined || listing.basePrice >= parsed.minPrice;
      const matchesMax = parsed.maxPrice === undefined || listing.basePrice <= parsed.maxPrice;

      return matchesCategory && matchesLocation && matchesQuery && matchesMin && matchesMax;
    });

    return {
      items,
      total: items.length,
    };
  }

  async getProviderStorefront(slug: string) {
    const provider = providers.find((item) => item.slug === slug);
    if (!provider) {
      throw new Error('Provider storefront not found');
    }

    return {
      provider,
      listings: listings.filter((listing) => listing.providerSlug === slug),
    };
  }
}
