import { AppShell } from '../../../modules/shared/AppShell';
import { FeaturePage } from '../../../modules/shared/FeaturePage';
import { adminFeatures } from '../../../modules/shared/featureCatalog';

export default function AdminListingsPage() {
  return (
    <AppShell>
      <FeaturePage feature={adminFeatures.listings} />
    </AppShell>
  );
}
