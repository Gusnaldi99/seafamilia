import type { Departure } from './types';

// 6 departures (3 per trip) — placeholder scheduling data pending a real
// booking calendar from the client (Aug 2026 client revision).
// status: open | limited | waitlist | closed
export const departures: Departure[] = [
  { id: 'SFD-2609-SF1', trip: 'three-days-aboard-sea-familia', boat: 'sea-familia', start: '2026-09-05', nights: 2, cabinsLeft: 3, price: 950, status: 'open', deposit: 0.25 },
  { id: 'SFD-2609-SF2', trip: 'three-days-aboard-sea-familia-2', boat: 'sea-familia-2', start: '2026-09-12', nights: 2, cabinsLeft: 2, price: 850, status: 'limited', deposit: 0.25 },
  { id: 'SFD-2610-SF1', trip: 'three-days-aboard-sea-familia', boat: 'sea-familia', start: '2026-10-03', nights: 2, cabinsLeft: 4, price: 950, status: 'open', deposit: 0.25 },
  { id: 'SFD-2610-SF2', trip: 'three-days-aboard-sea-familia-2', boat: 'sea-familia-2', start: '2026-10-17', nights: 2, cabinsLeft: 0, price: 850, status: 'waitlist', deposit: 0.25 },
  { id: 'SFD-2611-SF1', trip: 'three-days-aboard-sea-familia', boat: 'sea-familia', start: '2026-11-07', nights: 2, cabinsLeft: 1, price: 950, status: 'limited', deposit: 0.25 },
  { id: 'SFD-2611-SF2', trip: 'three-days-aboard-sea-familia-2', boat: 'sea-familia-2', start: '2026-11-21', nights: 2, cabinsLeft: 3, price: 850, status: 'open', deposit: 0.25 },
];
