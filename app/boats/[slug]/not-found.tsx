import { DetailNotFound } from '@/components/chrome/detail-not-found';
import { routes } from '@/lib/routes';

export default function NotFound() {
  return (
    <DetailNotFound
      title="Not one of ours"
      body="We sail four boats and that link points at none of them. The fleet is small on purpose — here they all are."
      primary={{ href: routes.boats(), label: 'See the fleet' }}
    />
  );
}
