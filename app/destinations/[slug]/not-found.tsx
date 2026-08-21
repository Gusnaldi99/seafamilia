import { DetailNotFound } from '@/components/chrome/detail-not-found';
import { routes } from '@/lib/routes';

export default function NotFound() {
  return (
    <DetailNotFound
      title="We do not sail there"
      body="Not yet, anyway. The link you followed points at a region that is not in our programme — we cover three, all near Labuan Bajo."
      primary={{ href: routes.destinations(), label: 'All our waters' }}
      secondary={{ href: routes.contact(), label: 'Suggest a region' }}
    />
  );
}
