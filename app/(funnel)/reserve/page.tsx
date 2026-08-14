import { Suspense } from 'react';
import type { Metadata } from 'next';
import { ReserveFlow } from './reserve-flow';

export const metadata: Metadata = {
  title: 'Reserve a Cabin',
  description: 'Find a departure, confirm the trip, choose a cabin, tell us who is coming, and reserve. Nothing is charged until a person confirms.',
  robots: { index: false, follow: false },
};

export default function ReservePage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <ReserveFlow />
    </Suspense>
  );
}
