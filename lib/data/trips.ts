import type { Trip } from './types';

// 2 trips — Sea Familia's real Open Trip (Leisure) lineup, one per boat,
// both 3D2N in Komodo (Aug 2026 client revision). Private charter (Leisure
// on either boat, or Diving on Sea Familia 2) is handled entirely by the
// /charter funnel and has no fixed-itinerary record here — see
// app/(funnel)/charter/charter-enquiry.tsx.
export const trips: Trip[] = [
  {
    slug: 'three-days-aboard-sea-familia',
    title: 'Three Days Aboard Sea Familia',
    water: 'komodo',
    boat: 'sea-familia',
    nights: 2,
    from: 950, // TODO: placeholder pricing, confirm with client
    ph: 'lagoon',
    experiences: ['family', 'wellness'],
    party: ['families', 'couples', 'friends'],
    editorPick: true,
    gateway: 'Labuan Bajo',
    summary:
      'A short one, for people with a long flight home. Three days, easy anchorages, no crossing longer than two hours.',
    story:
      'Built for the guest who has three days and does not want to spend them travelling. Komodo anchorages within easy reach of Labuan Bajo, and enough time in each to actually swim twice. The whole boat is often taken by one group.',
    highlights: ['Nothing further than two hours away', 'Whole boat often taken by one group', 'Padar at dawn on the last morning'],
    route: [
      { day: '1', title: 'Labuan Bajo — board and go', text: 'Aboard by 2pm, a short sail to Sebayur for the first night at anchor.' },
      { day: '2', title: 'Padar & Pink Beach', text: 'Padar ridge at sunrise, breakfast under way, an afternoon on Pink Beach.' },
      { day: '3', title: 'Rinca & Labuan Bajo', text: 'A ranger walk on Rinca at first light, then alongside by mid-morning.' },
    ],
  },
  {
    slug: 'three-days-aboard-sea-familia-2',
    title: 'Three Days Aboard Sea Familia 2',
    water: 'komodo',
    boat: 'sea-familia-2',
    nights: 2,
    from: 850, // TODO: placeholder pricing, confirm with client
    ph: 'reef',
    experiences: ['family', 'wellness'],
    party: ['families', 'couples', 'friends', 'solo'],
    editorPick: true,
    gateway: 'Labuan Bajo',
    summary:
      'Three days of shallow water and short crossings on the smaller boat, with a crew who run reef school in the morning.',
    story:
      'Nothing on this route takes more than three hours to reach, and nothing is deeper than it needs to be. Children get snorkel lessons in a lagoon they can stand up in, then graduate to the reef top with a crew member each. Everyone else gets the aft deck and dinner at whatever time the day turned out to allow.',
    highlights: [
      'Standing-depth lagoon for snorkel lessons',
      'Night-time plankton hunt off the swim platform',
      'Kayaks at every anchorage',
    ],
  },
];
