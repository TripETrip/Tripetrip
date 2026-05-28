import { FeaturePage } from '../../modules/shared/FeaturePage';
import { travelerFeatures } from '../../modules/shared/featureCatalog';
import { AppShell } from '../../modules/shared/AppShell';

export default function TripsPage() {
  return (
    <AppShell>
      <FeaturePage feature={travelerFeatures.trips} />
    </AppShell>
  );
}
