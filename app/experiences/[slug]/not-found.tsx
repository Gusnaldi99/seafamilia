import { DetailNotFound } from '@/components/chrome/detail-not-found';
import { routes } from '@/lib/routes';

export default function NotFound() {
  return (
    <DetailNotFound
      title="We have retired that one"
      body="The experience you followed a link to is no longer part of our programme — routes get folded into others as the seasons change. All six current ones are here."
      primary={{ href: routes.experiences(), label: 'All experiences' }}
      secondary={{ href: routes.contact(), label: 'Ask us what replaced it' }}
    />
  );
}
