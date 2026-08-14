import type { Experience } from './types';

// Ported verbatim from assets/js/data.js §2 (6 records).
export const experiences: Experience[] = [
  {
    slug: 'diving',
    name: 'Diving & Reefs',
    ph: 'reef',
    tagline: 'Reefs that still surprise the crew',
    blurb:
      'Three to four dives a day on walls, seamounts and coral gardens, led by guides who grew up on these reefs. Nitrox on board, small groups in the water, and no rushing back to the boat.',
    forWho: ['Certified divers', 'Confident snorkellers', 'Anyone working on a course'],
    signature: [
      'Manta cleaning stations at dawn',
      'Two dedicated tenders, never a queue',
      'Free nitrox for certified guests',
    ],
  },
  {
    slug: 'family',
    name: 'Family Voyages',
    ph: 'lagoon',
    tagline: 'Shallow water, long days, early dinners',
    blurb:
      'Routes built around calm anchorages and short crossings, with a crew who genuinely likes children. Snorkel lessons, kayaks, night-time plankton hunts and a kitchen that will make plain rice without a sigh.',
    forWho: ['Families with children 4+', 'Multi-generation groups', 'First-time sailors'],
    signature: ['Two interconnecting cabin pairs', 'Crew-led reef school for kids', 'Flexible meal times'],
  },
  {
    slug: 'remote',
    name: 'Remote Passages',
    ph: 'deep',
    tagline: 'Long crossings, few other boats',
    blurb:
      'Overnight sails between island groups where the chart still has blank patches. Ten to fourteen nights, a rhythm set by weather rather than schedule, and anchorages we sometimes name ourselves.',
    forWho: ['Experienced travellers', 'Divers chasing untouched sites', 'Sailors who like a night watch'],
    signature: ['Open-ended anchorage plans', 'Night watches you can join', 'Provisioning for two weeks out'],
  },
  {
    slug: 'culture',
    name: 'Culture & Craft',
    ph: 'village',
    tagline: 'Ikat looms, spice gardens, boat builders',
    blurb:
      'Village visits arranged by people who are related to half the village. Weaving on Solor, nutmeg drying in Banda, phinisi hulls taking shape in Bira — all on the villages’ terms, never as a photo stop.',
    forWho: ['Slow travellers', 'Textile and craft people', 'Anyone tired of resorts'],
    signature: ['Loom sessions with Solor weavers', 'Spice-garden walk in Banda Neira', 'Boatyard visit in Bira'],
  },
  {
    slug: 'wellness',
    name: 'Slow Sailing & Wellness',
    ph: 'boat',
    tagline: 'Sail more, motor less',
    blurb:
      'Fewer stops, longer sails, and mornings that start with a mat on the foredeck. Massage on the shaded aft deck, a kitchen leaning on what the market had, and permission to do absolutely nothing.',
    forWho: ['Couples', 'Solo travellers', 'Anyone off a hard year'],
    signature: ['Daily foredeck yoga', 'Two therapists in the crew', 'Sails up whenever the wind allows'],
  },
  {
    slug: 'light',
    name: 'Photography & Light',
    ph: 'sunset',
    tagline: 'Anchorages chosen for the hour, not the map',
    blurb:
      'Itineraries planned backwards from the light. Blue-hour departures, tender drop-offs on the right side of a ridge, a dry camera room with charging benches, and a crew that will happily wait ten more minutes.',
    forWho: ['Photographers and filmmakers', 'Drone pilots', 'Patient early risers'],
    signature: ['Golden-hour anchorage planning', 'Dry camera room + charging bench', 'Tender available at 4:45am'],
  },
];
