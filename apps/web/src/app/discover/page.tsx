import { FeaturePage } from '../../modules/shared/FeaturePage';
import { travelerFeatures } from '../../modules/shared/featureCatalog';
import { AppShell } from '../../modules/shared/AppShell';

export default function DiscoverPage() {
  return (
    <AppShell>
      <FeaturePage feature={travelerFeatures.discover} />
    </AppShell>
  );
}
