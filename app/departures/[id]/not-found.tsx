import { DetailNotFound } from '@/components/chrome/detail-not-found';
import { routes } from '@/lib/routes';

export default function NotFound() {
  return (
    <DetailNotFound
      title="That departure has gone"
      body="Either it has sailed, or the last cabin went and we closed it. The same routes run again — usually in the same months next season."
      primary={{ href: routes.departures(), label: 'Search every date' }}
      secondary={{ href: routes.contact(), label: 'Ask about next season' }}
    />
  );
}
