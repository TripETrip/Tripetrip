import { describe, expect, it } from 'vitest';
import { MarketplaceService } from '../../apps/api/src/modules/marketplace/marketplace.service';

describe('Marketplace discovery foundation', () => {
  it('lists public marketplace inventory by category', async () => {
    const service = new MarketplaceService();
    const results = await service.listListings({ category: 'homestay' });

    expect(results.items.map((item) => item.title)).toContain('Riverside Homestay');
    expect(results.items.every((item) => item.category === 'homestay')).toBe(true);
  });

  it('searches public marketplace inventory by intent text', async () => {
    const service = new MarketplaceService();
    const results = await service.listListings({ q: 'taxi' });

    expect(results.items).toHaveLength(1);
    expect(results.items[0]?.title).toBe('Certified Manali Taxi');
  });

  it('loads provider storefronts by slug', async () => {
    const service = new MarketplaceService();
    const storefront = await service.getProviderStorefront('demo-himalayan-collective');

    expect(storefront.provider.name).toBe('Demo Himalayan Collective');
    expect(storefront.listings.length).toBeGreaterThan(1);
  });

  it('throws a helpful error for unknown provider storefronts', async () => {
    const service = new MarketplaceService();

    await expect(service.getProviderStorefront('missing-provider')).rejects.toThrow('Provider storefront not found');
  });
});
