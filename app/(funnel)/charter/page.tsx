import { Suspense } from 'react';
import type { Metadata } from 'next';
import { CharterEnquiry } from './charter-enquiry';
import { photoIfExists, resolvePhotoMap } from '@/lib/photo';
import { LITERAL_PHOTOS, photoPath } from '@/lib/photo-paths';
import { boats } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Private Charter',
  description:
    'Take one of our two boats entirely to yourselves, on your dates, with a route we draw together. Four questions to start, and a real quote within one working day.',
};

export default function CharterPage() {
  const boatPhotos = resolvePhotoMap(boats, (b) => b.slug, (b) => photoPath.boat(b.slug));
  const heroPhoto = photoIfExists(LITERAL_PHOTOS.charter);

  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <CharterEnquiry boatPhotos={boatPhotos} heroPhoto={heroPhoto} />
    </Suspense>
  );
}
