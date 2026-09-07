import { Suspense } from 'react';
import type { Metadata } from 'next';
import { ReserveFlow } from './reserve-flow';
import { resolvePhotoMap } from '@/lib/photo';
import { photoPath } from '@/lib/photo-paths';
import { boats, trips } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Reserve a Cabin',
  description: 'Find a departure, confirm the trip, choose a cabin, tell us who is coming, and reserve. Nothing is charged until a person confirms.',
  robots: { index: false, follow: false },
};

const cabinEntries = boats.flatMap((b) => b.cabinTypes.map((c) => ({ boatSlug: b.slug, code: c.code })));

export default function ReservePage() {
  const tripPhotos = resolvePhotoMap(trips, (t) => t.slug, (t) => photoPath.trip(t.slug));
  const cabinPhotos = resolvePhotoMap(cabinEntries, (e) => `${e.boatSlug}-${e.code}`, (e) => photoPath.cabin(e.boatSlug, e.code));

  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <ReserveFlow tripPhotos={tripPhotos} cabinPhotos={cabinPhotos} />
    </Suspense>
  );
}
