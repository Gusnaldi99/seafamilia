import type { Metadata } from 'next';
import { ErrorScreen } from '@/components/chrome/error-screen';
import { photoIfExists } from '@/lib/photo';
import { LITERAL_PHOTOS } from '@/lib/photo-paths';

export const metadata: Metadata = {
  title: 'Planned Maintenance',
  description: 'The booking system is being updated and will be back within the hour.',
  robots: { index: false, follow: false },
};

export default function MaintenancePage() {
  return <ErrorScreen mode="maintenance" photoSrc={photoIfExists(LITERAL_PHOTOS.error)} />;
}
