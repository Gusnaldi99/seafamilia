import type { Trip } from './types';

// 3 trips — Sea Familia's real Open Trip (Leisure) lineup: two 3D2N trips
// (one per boat) and a 4D3N trip on sea-familia, all in Komodo (Sep 2026
// client itinerary revision, source: itinerary sea familia.pdf). Private
// charter (Leisure on either boat, or Diving on Sea Familia 2) is handled
// entirely by the /charter funnel and has no fixed-itinerary record here —
// see app/(funnel)/charter/charter-enquiry.tsx.
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
      { day: '1', title: 'Kelor, Manjarite & Kalong Rinca', text: 'Board in Labuan Bajo and sail to Kelor Island for a short trek, then Manjarite for a snorkel. Sunset over Kalong Rinca before anchoring for the night off Padar.' },
      { day: '2', title: 'Padar, Pink Beach & Komodo', text: 'A dawn trek up Padar’s ridge, breakfast underway to Pink Beach, then lunch and a ranger-led trek on Komodo Island. An afternoon snorkel at Manta Point before anchoring off Sebayur.' },
      { day: '3', title: 'Kanawa & Labuan Bajo', text: 'A last snorkel at Kanawa Island, breakfast on the sail back, alongside in Labuan Bajo by late morning.' },
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
    experiences: ['family', 'wellness', 'diving'],
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
    route: [
      { day: '1', title: 'Kelor, Manjarite & Kalong Rinca', text: 'Board in Labuan Bajo and sail to Kelor Island for a short trek, then Manjarite for a snorkel. Sunset over Kalong Rinca before anchoring for the night off Padar.' },
      { day: '2', title: 'Padar, Pink Beach & Komodo', text: 'A dawn trek up Padar’s ridge, breakfast underway to Pink Beach, then lunch and a ranger-led trek on Komodo Island. An afternoon snorkel at Manta Point before anchoring off Sebayur.' },
      { day: '3', title: 'Kanawa & Labuan Bajo', text: 'A last snorkel at Kanawa Island, breakfast on the sail back, alongside in Labuan Bajo by late morning.' },
    ],
  },
  {
    slug: 'four-days-aboard-sea-familia',
    title: 'Four Days Aboard Sea Familia',
    water: 'komodo',
    boat: 'sea-familia',
    nights: 3,
    from: 1250, // TODO: placeholder pricing, confirm with client
    ph: 'sunset',
    experiences: ['family', 'wellness'],
    party: ['families', 'couples', 'friends'],
    editorPick: false,
    gateway: 'Labuan Bajo',
    summary: 'The same easy Komodo anchorages, with an extra day for Taka Makassar and Mawan Island.',
    story:
      'Built for guests with a fourth day to spend rather than travel home on. Everything from the three-day route, plus a sandbar stop at Taka Makassar and lunch ashore on Mawan Island, before the same easy run back through Kanawa.',
    highlights: ['Two extra stops the 3-day route skips', 'Sunset over Kalong Rinca on night one', 'A full extra day of snorkeling'],
    route: [
      { day: '1', title: 'Kelor, Manjarite & Kalong Rinca', text: 'Board in Labuan Bajo and sail to Kelor Island for a short trek, then Manjarite for a snorkel, before anchoring off Rinca in time for sunset over Kalong Rinca.' },
      { day: '2', title: 'Padar & Pink Beach', text: 'A dawn trek up Padar’s ridge, breakfast underway to Pink Beach, then lunch and a ranger-led trek on Komodo Island before the overnight anchorage.' },
      { day: '3', title: 'Taka Makassar, Manta Point & Mawan', text: 'A sandbar stop at Taka Makassar, a snorkel at Manta Point, lunch ashore on Mawan Island, then on to Sebayur for the night.' },
      { day: '4', title: 'Kanawa & Labuan Bajo', text: 'A last snorkel at Kanawa Island, breakfast on the sail back, alongside in Labuan Bajo by late morning.' },
    ],
  },
];
