import type { Boat } from './types';

// 2 boats — Sea Familia's real fleet (Aug 2026 client revision). sea-familia
// is transcribed from the client's "Sea Familia Pricelist.pdf" brochure,
// including full private-charter pricing (see charterRates). sea-familia-2
// is transcribed from "Sea Familia II.pdf" for specs/cabins, but that
// brochure carries no pricing or inclusions page, so charterDay,
// cabinTypes[].price, included and excluded on sea-familia-2 remain the old
// placeholder values — still TODO pending a rate sheet from the client.
// Fields neither brochure confirms for either boat (crew; refit year;
// sea-familia's sail rig) also remain the old placeholder values, still
// marked TODO inline.
export const boats: Boat[] = [
  {
    slug: 'sea-familia',
    name: 'Sea Familia',
    type: 'Luxury wooden vessel', // was 'Traditional phinisi' — brochure never says "phinisi", uses this as its own subtitle
    ph: 'boat',
    tagline: 'The first boat. Still the one the family sails on.',
    blurb:
      'Built in Bira from ulin and teak, and sailing since 2019. Sea Familia carries twelve guests across six cabins — with a jacuzzi on the main deck and a sun deck above it — and sails Komodo, and only Komodo.',
    length: '25 m', // was '32 m' — now confirmed
    beam: '5.3 m', // was '8.4 m' — brochure also gives hull depth 2.1 m, no Boat field for this, intentionally not surfaced
    built: 2019, // was 2018 — now confirmed
    refit: 2023, // TODO: not given by the brochure, kept as the old placeholder
    cabins: 6, // was 8 — now confirmed
    guests: 12, // was 16 — now confirmed
    crew: 14, // TODO: not given by the brochure, kept as the old placeholder
    cruise: '6–9 knots', // was '9 knots' — now confirmed
    tenders: 2, // unchanged, now confirmed (2x Yamaha Enduro 40hp)
    decks: 3, // unchanged — matches the 3 named areas (Upper/Main/Sun deck)
    sails: 'Gaff-rigged ketch, 7 sails', // TODO: brochure gives no rig info at all; kept as the old placeholder, unconfirmed
    charterDay: 2769, // was 6800 — now the confirmed One Day Trip / 2D1N, 1-8 pax rate
    waters: ['komodo'],
    offersDiving: false,
    facilities: [
      'Upper-deck dining area',
      'Jacuzzi on the main deck',
      'Sun deck with loungers',
      'Karaoke and music system',
      'Air conditioning and private bathroom in every cabin',
      'Two tenders with 40hp Yamaha Enduro outboards',
    ],
    safety: [
      'Garmin Map585 Marine GPS',
      '25 life jackets and 4 ring buoys',
      'Life raft, 25-person capacity',
      'Marine radio, smoke signal and flare gun',
    ],
    gallery: ['boat', 'cabin', 'reef', 'sunset'],
    cabinTypes: [
      {
        code: 'MN',
        name: 'Manta Cabin',
        deck: 'Main deck',
        beds: 'Double', // TODO: exact bed config not stated in the brochure; inferred from 2-guest base occupancy
        occupancy: 2,
        maxOccupancy: 3,
        price: 422,
        left: 4,
        ph: 'cabin',
        features: ['Panoramic ocean view', 'Balcony access', 'Air conditioning and private bathroom', 'Extra bed available'],
      },
      {
        code: 'TR',
        name: 'Turtle Cabin',
        deck: 'Upper deck',
        beds: 'Double', // TODO: same inference as Manta
        occupancy: 2,
        maxOccupancy: 3,
        price: 360,
        left: 2,
        ph: 'cabin',
        features: ['Large portholes, plenty of natural light', 'Air conditioning and private bathroom', 'Extra bed available'],
      },
    ],
    included: [
      'All meals — breakfast, lunch and dinner',
      'Afternoon snacks and juices',
      'Unlimited mineral water, coffee and tea',
      'Snorkelling set — mask and snorkel',
      'Airport transfers on embarkation and disembarkation days',
      'Local guide and tour leader',
      'Life jacket and basic first aid',
      'Photo and video documentation, including drone',
    ],
    excluded: [
      'Hotel before or after the trip',
      'Transport from your home city to Labuan Bajo, return',
      'Komodo National Park fee — IDR 250,000 (Indonesian) / IDR 650,000 (foreign), paid locally',
      'Personal expenses',
      'Tipping for your guide and crew',
    ],
    charterRates: {
      paxBands: ['1–8 pax', '9–12 pax'],
      tiers: [
        { label: 'One Day Trip', nights: 0, prices: [2769, 3077] },
        { label: '2D1N', nights: 1, prices: [2769, 3077], extraBedPerPerson: 277 },
        { label: '3D2N', nights: 2, prices: [4923, 5231], extraBedPerPerson: 277 },
        { label: '4D3N', nights: 3, prices: [7077, 7538], extraBedPerPerson: 308 },
        { label: '5D4N', nights: 4, prices: [9231, 9846], extraBedPerPerson: 369 },
      ],
      addOns: [{ label: 'Diving, per person per day', pricePerPersonPerDay: 92 }],
    },
  },
  {
    slug: 'sea-familia-2',
    name: 'Sea Familia 2',
    type: 'Traditional phinisi', // confirmed — brochure's own words
    ph: 'night',
    tagline: 'Sixteen guests. Often booked whole, by one family.',
    blurb:
      'Sea Familia II is a traditional handcrafted phinisi yacht, built in 2018 from ulin and teak. Measuring 36.35 metres, she carries up to sixteen guests across six spacious cabins, with twin masts and red sails unmistakable from any anchorage.',
    length: '36.35 m', // was '24 m' — now confirmed
    beam: '7.5 m', // was '6.4 m' — brochure also gives hull depth 3.17 m, not surfaced (same as sea-familia)
    built: 2018, // was 2021 — now confirmed
    refit: 2025, // TODO: not given by the brochure, kept as the old placeholder
    cabins: 6, // was 4 — now confirmed
    guests: 16, // was 8 — now confirmed
    crew: 9, // TODO: not given by the brochure, kept as the old placeholder
    cruise: '6–9 knots', // was '9 knots' — now confirmed
    tenders: 1, // unchanged, now confirmed (1x 100hp Enduro tender)
    decks: 4, // was 2 — now confirmed (Top/Upper/Main/Lower deck plan)
    sails: 'Two masts, red sails', // was 'Ketch rig, 5 sails' — visual-only per the cover photo; brochure gives no technical rig-type term
    charterDay: 4200, // TODO: placeholder, confirm — no pricing page in this brochure
    waters: ['komodo', 'sumbawa', 'alor'],
    offersDiving: true,
    facilities: [
      'Sun deck with loungers',
      'Jacuzzi with scenic views',
      'Dining area with ocean views',
      'Front deck for open-air dining or lounging',
      'Dedicated dive deck',
      'Function room',
      'Air conditioning in every cabin',
    ],
    safety: [
      '3 life rafts, 16-person capacity each',
      '50 life vests and 8 life rings',
      'EPIRB and SART',
      'Emergency oxygen and first aid',
    ],
    gallery: ['night', 'cabin', 'jungle', 'boat'],
    cabinTypes: [
      {
        code: 'MC',
        name: 'Master Cabin',
        deck: 'Upper deck',
        beds: 'King',
        occupancy: 2,
        maxOccupancy: 3,
        price: 4400, // TODO: price is the old "Master Double" figure reused — no pricing page in this brochure
        left: 2,
        ph: 'cabin',
        features: ['Private balcony', 'Outdoor bathtub', 'En-suite with water heater', 'Extra bed available'],
      },
      {
        code: 'DC',
        name: 'Deluxe Cabin',
        deck: 'Upper & lower deck',
        beds: 'Twin',
        occupancy: 2,
        maxOccupancy: 2,
        price: 3600, // TODO: price is the old "Kecil Twin" figure reused
        left: 2,
        ph: 'cabin',
        features: ['En-suite bathroom', 'Water heater (lower-deck cabin only)', 'Large desk'],
      },
      {
        code: 'FC',
        name: 'Family Cabin',
        deck: 'Lower deck',
        beds: 'Queen + bunk',
        occupancy: 2,
        maxOccupancy: 4,
        price: 3950, // TODO: price is the old "Deck Double" figure reused
        left: 1,
        ph: 'cabin',
        features: ['Queen bed plus a bunk bed', 'En-suite bathroom', 'Air conditioning'],
      },
      {
        code: 'BB',
        name: 'Bunkbed Cabin',
        deck: 'Upper deck',
        beds: 'Bunk bed',
        occupancy: 2,
        maxOccupancy: 2,
        price: 3100, // TODO: price is the old "Solo Berth" figure reused
        left: 1,
        ph: 'cabin',
        features: ['En-suite bathroom', 'Air conditioning'],
      },
    ],
    included: [
      'All meals, snacks and soft drinks',
      'Filtered water, tea and coffee, always on',
      'Cabin with private ensuite and hot water',
      'Snorkelling gear and kayaks',
      'Tanks, weights and dive guides for certified divers',
      'Airport transfers on embarkation and disembarkation days',
      'Starlink wifi',
    ], // unchanged verbatim — no inclusions page in this brochure, still TODO
    excluded: [
      'Flights to and from the gateway port',
      'National park and marine conservation fees',
      'Dive equipment rental (available on board)',
      'Alcohol — bring your own, no corkage',
      'Massage and spa treatments',
      'Travel and diving insurance (required)',
      'Crew gratuities, entirely at your discretion',
    ], // unchanged verbatim — no exclusions page in this brochure, still TODO
    // no charterRates — brochure has no pricing page
  },
];
