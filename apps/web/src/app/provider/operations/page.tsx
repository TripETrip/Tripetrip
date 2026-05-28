import { AppShell } from '../../../modules/shared/AppShell';
import { FeaturePage } from '../../../modules/shared/FeaturePage';
import { providerFeatures } from '../../../modules/shared/featureCatalog';

export default function ProviderOperationsPage() {
  return (
    <AppShell>
      <FeaturePage feature={providerFeatures.operations} />
    </AppShell>
  );
}
