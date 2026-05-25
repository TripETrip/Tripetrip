import { AppShell } from '../modules/shared/AppShell';
import { TravelerHome } from '../modules/traveler/TravelerHome';

export const productPositioning = 'Travel Marketplace + Travel OS';

export default function Page() {
  return (
    <AppShell>
      <TravelerHome />
    </AppShell>
  );
}
