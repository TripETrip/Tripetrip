import { expect, test } from '@playwright/test';

test('traveler surface presents the Travel OS marketplace', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  await expect(page.getByText('Travel Marketplace + Travel OS')).toBeVisible();
  await expect(page.getByRole('heading', { name: /Book trusted travel services/i })).toBeVisible();
  await expect(page.getByText('AI trip planner')).toBeVisible();
  await expect(page.getByText('Escrow payments')).toBeVisible();
});

test('provider dashboard presents operating system modules', async ({ page }) => {
  await page.goto('/provider/dashboard', { waitUntil: 'domcontentloaded' });

  await expect(page.getByText('Provider Operating System')).toBeVisible();
  await expect(page.getByRole('heading', { name: /Manage bookings, inventory, staff/i })).toBeVisible();
  await expect(page.getByText('Booking command center')).toBeVisible();
  await expect(page.getByText('Payout tracker')).toBeVisible();
});

test('admin surface presents governance modules', async ({ page }) => {
  await page.goto('/admin', { waitUntil: 'domcontentloaded' });

  await expect(page.getByText('Platform Admin')).toBeVisible();
  await expect(page.getByRole('heading', { name: /Govern trust, safety, vendors/i })).toBeVisible();
  await expect(page.getByText('KYC review')).toBeVisible();
  await expect(page.getByText('Audit logs')).toBeVisible();
});
