import { Suspense } from 'react';
import type { Metadata } from 'next';
import { TripCard } from '@/components/cards/trip-card';
import { DepartureCard } from '@/components/cards/departure-card';
import { GuidedDiscovery } from './guided-discovery';
import { filterDepartures } from '@/lib/queries';
import { trips } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Plan Your Trip',
  description: 'Five quick questions, matched against every real itinerary — not a quiz that ends in a brochure.',
};

const availableDepartures = filterDepartures({ available: true });
const tripCards = Object.fromEntries(trips.map((t) => [t.slug, <TripCard key={t.slug} trip={t} />]));
const departureCards = Object.fromEntries(availableDepartures.map((d) => [d.id, <DepartureCard key={d.id} departure={d} hideCta />]));
const departureTrips = Object.fromEntries(availableDepartures.map((d) => [d.id, d.trip]));

export default function PlanPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <GuidedDiscovery tripCards={tripCards} departureCards={departureCards} departureTrips={departureTrips} />
    </Suspense>
  );
}
