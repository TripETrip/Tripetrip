import { AppShell } from '../../../modules/shared/AppShell';
import { FeaturePage } from '../../../modules/shared/FeaturePage';
import { providerFeatures } from '../../../modules/shared/featureCatalog';

export default function ProviderKycPage() {
  return (
    <AppShell>
      <FeaturePage feature={providerFeatures.kyc} />
    </AppShell>
  );
}
