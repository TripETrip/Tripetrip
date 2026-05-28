import { AppShell } from '../../modules/shared/AppShell';
import { FeaturePage } from '../../modules/shared/FeaturePage';
import { adminFeatures } from '../../modules/shared/featureCatalog';

export default function AdminPage() {
  return (
    <AppShell>
      <FeaturePage feature={adminFeatures.overview} />
    </AppShell>
  );
}
