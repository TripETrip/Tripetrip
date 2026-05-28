import { AppShell } from '../../../modules/shared/AppShell';
import { FeaturePage } from '../../../modules/shared/FeaturePage';
import { adminFeatures } from '../../../modules/shared/featureCatalog';

export default function AdminKycPage() {
  return (
    <AppShell>
      <FeaturePage feature={adminFeatures.kyc} />
    </AppShell>
  );
}
