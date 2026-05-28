import { AppShell } from '../../../modules/shared/AppShell';
import { FeaturePage } from '../../../modules/shared/FeaturePage';
import { adminFeatures } from '../../../modules/shared/featureCatalog';

export default function AdminCommunityPage() {
  return (
    <AppShell>
      <FeaturePage feature={adminFeatures.community} />
    </AppShell>
  );
}
