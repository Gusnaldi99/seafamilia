import { DetailNotFound } from '@/components/chrome/detail-not-found';
import { routes } from '@/lib/routes';

export default function NotFound() {
  return (
    <DetailNotFound
      title="That itinerary has sailed"
      body="Routes get retired, renamed or folded into longer crossings between seasons. Here is everything currently on the programme — and if you know what it was called, we will tell you what replaced it."
      primary={{ href: routes.destinations(), label: 'All itineraries' }}
      secondary={{ href: routes.contact(), label: 'Ask what replaced it' }}
    />
  );
}
