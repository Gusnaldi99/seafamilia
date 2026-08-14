import type { Departure } from './types';

// Ported verbatim from assets/js/data.js §6 (16 records).
// status: open | limited | waitlist | closed
export const departures: Departure[] = [
  { id: 'SFD-2608-MPA', trip: 'manta-passage', boat: 'familia-satu', start: '2026-08-22', nights: 7, cabinsLeft: 2, price: 3450, status: 'limited', deposit: 0.25 },
  { id: 'SFD-2609-TFK', trip: 'the-four-kings', boat: 'nusa-ombak', start: '2026-09-06', nights: 10, cabinsLeft: 5, price: 5900, status: 'open', deposit: 0.25 },
  { id: 'SFD-2609-WOS', trip: 'weavers-of-solor', boat: 'bintang-laut', start: '2026-09-14', nights: 8, cabinsLeft: 3, price: 4150, status: 'open', deposit: 0.25 },
  { id: 'SFD-2609-TVR', trip: 'the-volcano-run', boat: 'familia-satu', start: '2026-09-24', nights: 12, cabinsLeft: 1, price: 6750, status: 'limited', deposit: 0.3 },
  { id: 'SFD-2610-HHS', trip: 'hammerhead-season', boat: 'bintang-laut', start: '2026-10-04', nights: 9, cabinsLeft: 0, price: 5200, status: 'waitlist', deposit: 0.25 },
  { id: 'SFD-2610-LLE', trip: 'lagoons-little-explorers', boat: 'nusa-ombak', start: '2026-10-12', nights: 5, cabinsLeft: 4, price: 2680, status: 'open', deposit: 0.25 },
  { id: 'SFD-2610-TSR', trip: 'the-spice-route', boat: 'familia-satu', start: '2026-10-20', nights: 10, cabinsLeft: 4, price: 5750, status: 'open', deposit: 0.25 },
  { id: 'SFD-2611-MSL', trip: 'misool-slowly', boat: 'layar-kecil', start: '2026-11-02', nights: 7, cabinsLeft: 2, price: 4400, status: 'limited', deposit: 0.3 },
  { id: 'SFD-2611-SCC', trip: 'soft-coral-country', boat: 'familia-satu', start: '2026-11-15', nights: 9, cabinsLeft: 6, price: 5350, status: 'open', deposit: 0.25 },
  { id: 'SFD-2612-TNF', trip: 'three-nights-four-islands', boat: 'layar-kecil', start: '2026-12-04', nights: 3, cabinsLeft: 1, price: 1590, status: 'limited', deposit: 0.25 },
  { id: 'SFD-2612-TFK', trip: 'the-four-kings', boat: 'nusa-ombak', start: '2026-12-18', nights: 10, cabinsLeft: 0, price: 6400, status: 'closed', deposit: 0.25 },
  { id: 'SFD-2701-ADR', trip: 'atoll-drift', boat: 'bintang-laut', start: '2027-01-09', nights: 6, cabinsLeft: 5, price: 3280, status: 'open', deposit: 0.25 },
  { id: 'SFD-2702-WSC', trip: 'whale-sharks-of-cenderawasih', boat: 'nusa-ombak', start: '2027-02-06', nights: 11, cabinsLeft: 7, price: 6300, status: 'open', deposit: 0.25 },
  { id: 'SFD-2703-MPA', trip: 'manta-passage', boat: 'familia-satu', start: '2027-03-14', nights: 7, cabinsLeft: 8, price: 3450, status: 'open', deposit: 0.25 },
  { id: 'SFD-2704-TVR', trip: 'the-volcano-run', boat: 'familia-satu', start: '2027-04-02', nights: 12, cabinsLeft: 6, price: 6750, status: 'open', deposit: 0.3 },
  { id: 'SFD-2705-MSL', trip: 'misool-slowly', boat: 'layar-kecil', start: '2027-05-08', nights: 7, cabinsLeft: 3, price: 4400, status: 'open', deposit: 0.3 },
];
