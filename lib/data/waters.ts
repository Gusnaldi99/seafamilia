import type { Water } from './types';

// 3 waters — Sea Familia's real operating scope (Aug 2026 client revision).
// Komodo is served by both boats; Sumbawa and Alor by Sea Familia 2 only.
export const waters: Water[] = [
  {
    slug: 'komodo',
    name: 'Komodo & the Flores Sea',
    short: 'Komodo',
    ph: 'lagoon',
    gateway: 'Labuan Bajo',
    season: 'April – November',
    crossing: 'Short hops, calm nights',
    blurb:
      'Pink beaches, hard-coral ridges and current-fed cleaning stations, all within a few hours of each other.',
    story:
      'The Flores Sea funnels cold water between islands twice a day, and everything here is organised around that. Reefs sit on the corners where the current bites; the mantas queue where it slows. Because nothing is far from anything, Komodo is where we send people who want a full week without a single long crossing — and where we take our own families.',
    highlights: [
      'Manta cleaning stations at Karang Makassar',
      'Hard-coral ridge at Batu Bolong',
      'Rangers’ walk on Rinca at first light',
    ],
    stops: ['Labuan Bajo', 'Sebayur', 'Batu Bolong', 'Karang Makassar', 'Padar', 'Pink Beach', 'Rinca', 'Siaba Bay', 'Sabolan'],
    bestFor: ['diving', 'family', 'wellness'],
  },
  {
    slug: 'sumbawa',
    name: 'Sumbawa & Teluk Saleh',
    short: 'Sumbawa',
    ph: 'volcano',
    // TODO: placeholder content, no client-supplied copy exists yet for this water — confirm before launch.
    gateway: 'Sumbawa Besar',
    season: 'April – November',
    crossing: 'Sheltered bay, short hops',
    blurb: 'A wide, sheltered bay ringed by volcanic islands, with manta cleaning stations of its own.',
    story:
      'Teluk Saleh is a huge, calm bay rather than an open crossing, which keeps the sailing easy while the diving stays serious — Moyo and Satonda sit inside it as two very different islands, one jungle-and-waterfall, one an old volcanic crater now a saltwater lake. We run this route on Sea Familia 2 alongside Komodo and Alor.',
    highlights: [
      'Manta cleaning stations inside the bay',
      'Moyo Island’s waterfalls, a short walk from the beach',
      'Satonda’s crater lake, a dinghy ride from the boat',
    ],
    stops: ['Sumbawa Besar', 'Moyo Island', 'Satonda', 'Medang'],
    bestFor: ['diving', 'family'],
  },
  {
    slug: 'alor',
    name: 'Alor',
    short: 'Alor',
    ph: 'village',
    // TODO: story/blurb rewritten to drop the Solor-archipelago content — confirm accuracy with client before launch.
    gateway: 'Kupang',
    season: 'May – October',
    crossing: 'Straits and tide gates',
    blurb: 'Cold upwellings and black-sand muck slopes, in straits that squeeze the current hard.',
    story:
      'The straits around Alor squeeze cold water up from the deep, which means muck diving with things you will not find further west, and reef fish behaving strangely well. We arrive on Sea Familia 2, the only boat in the fleet that reaches this far.',
    highlights: ['Cold-water muck slopes off Alor', 'Kalabahi’s reef-top villages', 'Straits diving on the tide change'],
    stops: ['Kupang', 'Pantar', 'Kalabahi', 'Alor Kecil'],
    bestFor: ['culture', 'diving', 'remote'],
  },
];
