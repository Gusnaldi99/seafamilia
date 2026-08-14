import { DetailNotFound } from '@/components/chrome/detail-not-found';
import { routes } from '@/lib/routes';

export default function NotFound() {
  return (
    <DetailNotFound
      title="We cannot find that piece"
      body="The archive is small — eight pieces — so this is almost certainly a broken link rather than something we removed. Here is everything."
      primary={{ href: routes.journal(), label: 'The whole journal' }}
    />
  );
}
