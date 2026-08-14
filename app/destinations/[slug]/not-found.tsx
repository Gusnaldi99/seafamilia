import { DetailNotFound } from '@/components/chrome/detail-not-found';
import { routes } from '@/lib/routes';

export default function NotFound() {
  return (
    <DetailNotFound
      title="We do not sail there"
      body="Not yet, anyway. The link you followed points at a region that is not in our programme — we cover eight, all in eastern Indonesia."
      primary={{ href: routes.destinations(), label: 'All eight waters' }}
      secondary={{ href: routes.contact(), label: 'Suggest a region' }}
    />
  );
}
