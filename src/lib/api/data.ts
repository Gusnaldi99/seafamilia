/* ============================================================================
   Sea Familia — Mock data layer
   Ported from the static data.js. Each export mirrors the API endpoint
   the backend will eventually provide.
   ============================================================================ */

import type {
  Experience,
  Water,
  Boat,
  Trip,
  Departure,
  CabinType,
  Article,
  TeamMember,
  FAQ,
  Inclusions,
  LengthBucket,
  PartyOption,
} from "@/types";

export type {
  Experience,
  Water,
  Boat,
  Trip,
  Departure,
  CabinType,
  Article,
  TeamMember,
  FAQ,
  Inclusions,
  LengthBucket,
  PartyOption,
};

// ---------- Experiences ----------

export const experiences: Experience[] = [
  {
    slug: "diving", name: "Diving & Reefs", ph: "reef",
    tagline: "Reefs that still surprise the crew",
    blurb: "Three to four dives a day on walls, seamounts and coral gardens, led by guides who grew up on these reefs. Nitrox on board, small groups in the water, and no rushing back to the boat.",
    forWho: ["Certified divers", "Confident snorkellers", "Anyone working on a course"],
    signature: ["Manta cleaning stations at dawn", "Two dedicated tenders, never a queue", "Free nitrox for certified guests"],
  },
  {
    slug: "family", name: "Family Voyages", ph: "lagoon",
    tagline: "Shallow water, long days, early dinners",
    blurb: "Routes built around calm anchorages and short crossings, with a crew who genuinely likes children. Snorkel lessons, kayaks, night-time plankton hunts and a kitchen that will make plain rice without a sigh.",
    forWho: ["Families with children 4+", "Multi-generation groups", "First-time sailors"],
    signature: ["Two interconnecting cabin pairs", "Crew-led reef school for kids", "Flexible meal times"],
  },
  {
    slug: "remote", name: "Remote Passages", ph: "deep",
    tagline: "Long crossings, few other boats",
    blurb: "Overnight sails between island groups where the chart still has blank patches. Ten to fourteen nights, a rhythm set by weather rather than schedule, and anchorages we sometimes name ourselves.",
    forWho: ["Experienced travellers", "Divers chasing untouched sites", "Sailors who like a night watch"],
    signature: ["Open-ended anchorage plans", "Night watches you can join", "Provisioning for two weeks out"],
  },
  {
    slug: "culture", name: "Culture & Craft", ph: "village",
    tagline: "Ikat looms, spice gardens, boat builders",
    blurb: "Village visits arranged by people who are related to half the village. Weaving on Solor, nutmeg drying in Banda, phinisi hulls taking shape in Bira — all on the villages' terms, never as a photo stop.",
    forWho: ["Slow travellers", "Textile and craft people", "Anyone tired of resorts"],
    signature: ["Loom sessions with Solor weavers", "Spice-garden walk in Banda Neira", "Boatyard visit in Bira"],
  },
  {
    slug: "wellness", name: "Slow Sailing & Wellness", ph: "boat",
    tagline: "Sail more, motor less",
    blurb: "Fewer stops, longer sails, and mornings that start with a mat on the foredeck. Massage on the shaded aft deck, a kitchen leaning on what the market had, and permission to do absolutely nothing.",
    forWho: ["Couples", "Solo travellers", "Anyone off a hard year"],
    signature: ["Daily foredeck yoga", "Two therapists in the crew", "Sails up whenever the wind allows"],
  },
  {
    slug: "light", name: "Photography & Light", ph: "sunset",
    tagline: "Anchorages chosen for the hour, not the map",
    blurb: "Itineraries planned backwards from the light. Blue-hour departures, tender drop-offs on the right side of a ridge, a dry camera room with charging benches, and a crew that will happily wait ten more minutes.",
    forWho: ["Photographers and filmmakers", "Drone pilots", "Patient early risers"],
    signature: ["Golden-hour anchorage planning", "Dry camera room + charging bench", "Tender available at 4:45am"],
  },
];

// ---------- Waters ----------

export const waters: Water[] = [
  {
    slug: "komodo", name: "Komodo & the Flores Sea", short: "Komodo", ph: "lagoon",
    gateway: "Labuan Bajo", season: "April – November", crossing: "Short hops, calm nights",
    blurb: "Pink beaches, hard-coral ridges and current-fed cleaning stations, all within a few hours of each other.",
    story: "The Flores Sea funnels cold water between islands twice a day, and everything here is organised around that. Reefs sit on the corners where the current bites; the mantas queue where it slows.",
    highlights: ["Manta cleaning stations at Karang Makassar", "Hard-coral ridge at Batu Bolong", "Rangers' walk on Rinca at first light"],
    stops: ["Labuan Bajo", "Sebayur", "Batu Bolong", "Karang Makassar", "Padar", "Pink Beach", "Rinca", "Siaba Bay", "Sabolan"],
    bestFor: ["diving", "family", "wellness"],
  },
  {
    slug: "raja-ampat", name: "Raja Ampat", short: "Raja Ampat", ph: "reef",
    gateway: "Sorong", season: "October – April", crossing: "Overnight between kingdoms",
    blurb: "The richest reef fish count on the planet, spread across four island kingdoms and a thousand limestone islets.",
    story: "Fifteen hundred islands, and the reef holds more fish species per hectare than anywhere surveyed.",
    highlights: ["Misool's karst lagoons at dawn", "Manta highway through Dampier Strait", "Wayag viewpoint before the heat"],
    stops: ["Sorong", "Kri", "Dampier Strait", "Yangeffo", "Misool", "Boo Windows", "Fiabacet", "Wayag", "Aljui Bay"],
    bestFor: ["diving", "remote", "light"],
  },
  {
    slug: "banda", name: "The Banda Sea", short: "Banda Sea", ph: "volcano",
    gateway: "Ambon or Saumlaki", season: "March – April, September – October", crossing: "Real open-water passages",
    blurb: "Volcano walls, hammerhead season and the nutmeg islands that once redrew the map of Europe.",
    story: "This is the crossing our crew talks about in the off season. Deep blue water, seamounts that rise out of nowhere.",
    highlights: ["The 1988 lava flow, now solid coral", "Hammerheads at Nil Desperandum in season", "Nutmeg gardens behind Fort Belgica"],
    stops: ["Ambon", "Nusa Laut", "Koon", "Banda Neira", "Gunung Api", "Hatta", "Manuk", "Nil Desperandum", "Serua"],
    bestFor: ["remote", "diving", "culture"],
  },
  {
    slug: "alor", name: "Alor & Solor", short: "Alor & Solor", ph: "village",
    gateway: "Maumere to Kupang", season: "May – October", crossing: "Straits and tide gates",
    blurb: "Cold upwellings, black-sand slopes and the ikat weaving villages of the Solor archipelago.",
    story: "The straits here squeeze cold water up from the deep, which means muck diving with things you will not find further west.",
    highlights: ["Ikat looms in Lamalera and Solor", "Cold-water muck slopes off Alor", "Whale-bone chapel on Lembata"],
    stops: ["Maumere", "Adonara", "Solor", "Lembata", "Pantar", "Kalabahi", "Alor Kecil", "Kupang"],
    bestFor: ["culture", "diving", "remote"],
  },
  {
    slug: "triton", name: "Triton Bay", short: "Triton Bay", ph: "jungle",
    gateway: "Kaimana", season: "November – April", crossing: "Sheltered, jungle-edged",
    blurb: "Soft coral in colours that look edited, whale sharks over fishing platforms, and almost no other boats.",
    story: "Nutrient-heavy green water and no swell means soft coral grows here like nowhere else.",
    highlights: ["Soft-coral walls at Little Komodo", "Whale sharks under the bagans", "Rock paintings on the karst cliffs"],
    stops: ["Kaimana", "Triton Bay", "Aiduma", "Little Komodo", "Bo'o", "Namatota", "Iris Strait"],
    bestFor: ["diving", "light", "remote"],
  },
  {
    slug: "wakatobi", name: "Wakatobi & the Tukang Besi", short: "Wakatobi", ph: "reef",
    gateway: "Wangi-Wangi", season: "March – December", crossing: "Atoll to atoll",
    blurb: "Four atolls, wall diving that starts a metre from the tender, and Bajo stilt villages on the horizon.",
    story: "The Tukang Besi chain is essentially one long drop-off.",
    highlights: ["Wall diving straight off the reef top", "Bajo stilt village on Kaledupa", "Night dives on Hoga's slope"],
    stops: ["Wangi-Wangi", "Hoga", "Kaledupa", "Tomia", "Binongko", "Runduma"],
    bestFor: ["diving", "wellness", "culture"],
  },
  {
    slug: "cenderawasih", name: "Cenderawasih Bay", short: "Cenderawasih", ph: "deep",
    gateway: "Nabire or Manokwari", season: "May – October", crossing: "Long, flat, remote",
    blurb: "The one place where whale sharks are residents rather than visitors, and the reef has evolved alone.",
    story: "Cenderawasih has been geologically semi-isolated long enough to grow its own endemic species.",
    highlights: ["Resident whale sharks, hours not minutes", "WWII wrecks in shallow water", "Endemic reef fish found nowhere else"],
    stops: ["Nabire", "Kwatisore", "Roon", "Mioswaar", "Rumberpon", "Manokwari"],
    bestFor: ["diving", "family", "remote"],
  },
  {
    slug: "halmahera", name: "Halmahera & Ternate", short: "Halmahera", ph: "market",
    gateway: "Ternate", season: "March – May, September – November", crossing: "Volcanic island chain",
    blurb: "The original spice islands: clove-covered volcanoes, sultans' forts and reefs nobody has named yet.",
    story: "Ternate and Tidore are two perfect volcanic cones facing each other across a strait.",
    highlights: ["Clove terraces on Tidore", "Sultan's fort and archive in Ternate", "Unsurveyed reef along west Halmahera"],
    stops: ["Ternate", "Tidore", "Makian", "Widi Islands", "Guraici", "Bacan", "Kayoa"],
    bestFor: ["culture", "remote", "light"],
  },
];

// ---------- Boats ----------

export const boats: Boat[] = [
  {
    slug: "familia-satu", name: "Familia Satu", type: "Traditional phinisi", ph: "boat",
    tagline: "The first boat. Still the one the family sails on.",
    blurb: "Built in Bira in 2016 by the Konjo shipwrights our grandfather worked beside, and refitted in 2023 without losing a single beam of the original ironwood.",
    length: "32 m", beam: "8.4 m", built: 2016, refit: 2023,
    cabins: 8, guests: 16, crew: 14, cruise: "9 knots", tenders: 2,
    decks: 3, sails: "Gaff-rigged ketch, 7 sails", charterDay: 6800,
    facilities: ["Shaded main-deck lounge", "Sun deck with daybeds", "Dive deck with two tenders", "Nitrox membrane", "Freshwater deck showers", "Massage corner aft", "Chart table and library", "Camera room with charging bench", "Starlink and hot water throughout"],
    safety: ["Oxygen and first-response kit on both decks", "DAN-affiliated evacuation cover", "Two liferafts, EPIRB and satellite phone", "Crew drilled monthly"],
    gallery: ["boat", "cabin", "reef", "sunset"],
    cabinTypes: [
      { code: "OM", name: "Ocean Master", deck: "Main deck", beds: "King", occupancy: 2, maxOccupancy: 3, price: 4150, left: 1, ph: "cabin", features: ["Sea-level windows", "Ensuite with tub", "Writing desk", "18 m²"] },
      { code: "UD", name: "Upper Deck Double", deck: "Upper deck", beds: "Queen", occupancy: 2, maxOccupancy: 2, price: 3650, left: 2, ph: "cabin", features: ["Private balcony hatch", "Ensuite shower", "14 m²"] },
      { code: "TW", name: "Familia Twin", deck: "Lower deck", beds: "Two singles", occupancy: 2, maxOccupancy: 3, price: 3450, left: 3, ph: "cabin", features: ["Interconnects with a second twin", "Ensuite shower", "13 m²"] },
      { code: "SL", name: "Solo Berth", deck: "Lower deck", beds: "Single", occupancy: 1, maxOccupancy: 1, price: 2950, left: 1, ph: "cabin", features: ["No single supplement", "Ensuite shower", "9 m²"] },
    ],
  },
  {
    slug: "bintang-laut", name: "Bintang Laut", type: "Gaff schooner", ph: "deep",
    tagline: "Twelve guests, and a rig that actually gets used.",
    blurb: "Narrower and faster than her sisters, Bintang Laut was drawn for sailing rather than motoring.",
    length: "28 m", beam: "7.2 m", built: 2018, refit: 2024,
    cabins: 6, guests: 12, crew: 11, cruise: "10 knots", tenders: 2,
    decks: 2, sails: "Gaff schooner, 5 sails", charterDay: 5400,
    facilities: ["Open aft dive deck", "Nitrox membrane", "Two tenders with dive ladders", "Shaded lounge with chart table", "Sun deck hammocks", "Freshwater deck showers", "Camera table with charging bench", "Starlink"],
    safety: ["Oxygen and first-response kit", "DAN-affiliated evacuation cover", "Two liferafts, EPIRB and satellite phone", "Crew drilled monthly"],
    gallery: ["deep", "cabin", "reef", "boat"],
    cabinTypes: [
      { code: "MD", name: "Master Double", deck: "Main deck", beds: "King", occupancy: 2, maxOccupancy: 2, price: 3850, left: 1, ph: "cabin", features: ["Corner windows", "Ensuite shower", "15 m²"] },
      { code: "DD", name: "Deck Double", deck: "Main deck", beds: "Queen", occupancy: 2, maxOccupancy: 2, price: 3450, left: 2, ph: "cabin", features: ["Opening port", "Ensuite shower", "12 m²"] },
      { code: "TW", name: "Sailor Twin", deck: "Lower deck", beds: "Two singles", occupancy: 2, maxOccupancy: 2, price: 3180, left: 2, ph: "cabin", features: ["Reading lights", "Ensuite shower", "11 m²"] },
      { code: "SL", name: "Solo Berth", deck: "Lower deck", beds: "Single", occupancy: 1, maxOccupancy: 1, price: 2680, left: 0, ph: "cabin", features: ["No single supplement", "Shared shower", "8 m²"] },
    ],
  },
  {
    slug: "nusa-ombak", name: "Nusa Ombak", type: "Large phinisi", ph: "sunset",
    tagline: "Room for the whole extended family, cousins included.",
    blurb: "Forty metres, twenty guests, ten cabins — four of which interconnect.",
    length: "40 m", beam: "9.6 m", built: 2020, refit: 2025,
    cabins: 10, guests: 20, crew: 17, cruise: "9 knots", tenders: 3,
    decks: 4, sails: "Ketch rig, 7 sails", charterDay: 9500,
    facilities: ["Two shaded lounges", "Sun deck with plunge pool", "Three tenders", "Nitrox membrane", "Kids' reef-school corner", "Two massage rooms", "Cinema screen on the sky deck", "Camera room", "Starlink and hot water throughout"],
    safety: ["Oxygen on three decks", "DAN-affiliated evacuation cover", "Three liferafts, EPIRB and satellite phone", "Two crew with wilderness-medic training"],
    gallery: ["sunset", "cabin", "lagoon", "boat"],
    cabinTypes: [
      { code: "OS", name: "Owner\u2019s Suite", deck: "Sky deck", beds: "King", occupancy: 2, maxOccupancy: 3, price: 5400, left: 1, ph: "cabin", features: ["Private terrace", "Tub and rain shower", "Day bed", "26 m²"] },
      { code: "FS", name: "Family Suite", deck: "Main deck", beds: "King + two singles", occupancy: 4, maxOccupancy: 4, price: 4200, left: 2, ph: "cabin", features: ["Interconnecting door", "Two ensuites", "24 m²"] },
      { code: "UD", name: "Upper Double", deck: "Upper deck", beds: "Queen", occupancy: 2, maxOccupancy: 3, price: 3900, left: 3, ph: "cabin", features: ["Sea-view window", "Ensuite shower", "15 m²"] },
      { code: "TW", name: "Ombak Twin", deck: "Lower deck", beds: "Two singles", occupancy: 2, maxOccupancy: 2, price: 3500, left: 4, ph: "cabin", features: ["Interconnects", "Ensuite shower", "13 m²"] },
    ],
  },
  {
    slug: "layar-kecil", name: "Layar Kecil", type: "Intimate ketch", ph: "night",
    tagline: "Eight guests. Often booked whole, by one family.",
    blurb: "The small one, and deliberately so. Four cabins, eight guests, nine crew.",
    length: "24 m", beam: "6.4 m", built: 2021, refit: 2025,
    cabins: 4, guests: 8, crew: 9, cruise: "9 knots", tenders: 1,
    decks: 2, sails: "Ketch rig, 5 sails", charterDay: 4200,
    facilities: ["Single shaded lounge, guest-run playlist", "Foredeck yoga mats", "One tender, always available", "Nitrox on request", "Freshwater deck shower", "Massage on the aft deck", "Small library", "Starlink"],
    safety: ["Oxygen and first-response kit", "DAN-affiliated evacuation cover", "Liferaft, EPIRB and satellite phone", "Crew drilled monthly"],
    gallery: ["night", "cabin", "jungle", "boat"],
    cabinTypes: [
      { code: "MD", name: "Master Double", deck: "Main deck", beds: "King", occupancy: 2, maxOccupancy: 2, price: 4400, left: 1, ph: "cabin", features: ["Full-beam cabin", "Ensuite with tub", "20 m²"] },
      { code: "DD", name: "Deck Double", deck: "Main deck", beds: "Queen", occupancy: 2, maxOccupancy: 2, price: 3950, left: 1, ph: "cabin", features: ["Opening port", "Ensuite shower", "14 m²"] },
      { code: "TW", name: "Kecil Twin", deck: "Lower deck", beds: "Two singles", occupancy: 2, maxOccupancy: 2, price: 3600, left: 2, ph: "cabin", features: ["Ensuite shower", "12 m²"] },
      { code: "SL", name: "Solo Berth", deck: "Lower deck", beds: "Single", occupancy: 1, maxOccupancy: 1, price: 3100, left: 1, ph: "cabin", features: ["No single supplement", "Ensuite shower", "9 m²"] },
    ],
  },
];

// ---------- Trips ----------

export const trips: Trip[] = [
  {
    slug: "manta-passage", title: "Manta Passage", water: "komodo", boat: "familia-satu",
    nights: 7, from: 3450, ph: "reef", experiences: ["diving", "light"],
    party: ["couples", "friends", "solo"], editorPick: true, gateway: "Labuan Bajo",
    summary: "A full week on the current lines of the Flores Sea, timed so the tide is right at the cleaning stations rather than merely convenient.",
    story: "We built this one around slack water. Every anchorage is chosen so that the tide turns while you are on the reef.",
    highlights: ["Four dives a day at slack water", "Padar ridge before the day boats", "Ranger walk on Rinca at 5:40am"],
    route: [
      { day: "1", title: "Labuan Bajo — board and go", text: "Aboard by 2pm, check dive, then a short sail to Sebayur for the first night at anchor." },
      { day: "2", title: "Batu Bolong & Tatawa", text: "The hard-coral ridge on the turn of the tide, then a drift over Tatawa's garden." },
      { day: "3", title: "Karang Makassar", text: "Mantas on the sand flat at slack, twice. Afternoon on Pink Beach." },
      { day: "4", title: "Padar & Rinca", text: "Padar ridge at 5am, breakfast under way, rangers on Rinca before the heat." },
      { day: "5", title: "Crystal & Castle Rock", text: "North Komodo's two seamounts, both with schooling trevally. Night dive at Siaba." },
      { day: "6", title: "Sabolan, sails up", text: "One long dive, then a sailing afternoon back west. Kitchen does the whole-fish dinner." },
      { day: "7", title: "Labuan Bajo", text: "Last shallow reef at dawn, alongside by 8am, transfers to the airport." },
    ],
  },
  {
    slug: "lagoons-little-explorers", title: "Lagoons & Little Explorers", water: "komodo",
    boat: "nusa-ombak", nights: 5, from: 2680, ph: "lagoon",
    experiences: ["family", "wellness"], party: ["families"], gateway: "Labuan Bajo",
    summary: "Five nights of shallow water and short crossings, with a crew who run reef school in the morning and plankton hunts after dark.",
  },
  {
    slug: "the-four-kings", title: "The Four Kings", water: "raja-ampat", boat: "nusa-ombak",
    nights: 10, from: 5900, ph: "reef", experiences: ["diving", "remote", "light"],
    party: ["couples", "friends", "solo"], editorPick: true, gateway: "Sorong",
    summary: "Ten nights across two of Raja Ampat's four kingdoms — the fast water of Dampier Strait and the quiet karst of Misool.",
  },
  {
    slug: "misool-slowly", title: "Misool, Slowly", water: "raja-ampat", boat: "layar-kecil",
    nights: 7, from: 4400, ph: "jungle", experiences: ["wellness", "remote", "light"],
    party: ["couples", "solo"], gateway: "Sorong",
    summary: "One region, one week, eight guests. The itinerary is a list of anchorages we might use, in no fixed order.",
  },
  {
    slug: "the-volcano-run", title: "The Volcano Run", water: "banda", boat: "familia-satu",
    nights: 12, from: 6750, ph: "volcano", experiences: ["remote", "diving", "culture"],
    party: ["couples", "friends", "solo"], editorPick: true, gateway: "Ambon to Ambon",
    summary: "Twelve nights of open water, seamounts that appear from nowhere, and the nutmeg town that once traded island-for-island with Manhattan.",
  },
  {
    slug: "hammerhead-season", title: "Hammerhead Season", water: "banda",
    boat: "bintang-laut", nights: 9, from: 5200, ph: "deep", experiences: ["diving", "remote"],
    party: ["friends", "solo"], gateway: "Ambon to Saumlaki",
    summary: "Nine nights aimed squarely at the seamounts, in the two-week window when the schools show up.",
  },
  {
    slug: "weavers-of-solor", title: "Weavers of Solor", water: "alor", boat: "bintang-laut",
    nights: 8, from: 4150, ph: "village", experiences: ["culture", "diving"],
    party: ["couples", "solo", "friends"], gateway: "Maumere to Kupang",
    summary: "Eight nights through the Solor archipelago with the weaving families we have visited for eleven years.",
  },
  {
    slug: "soft-coral-country", title: "Soft Coral Country", water: "triton",
    boat: "familia-satu", nights: 9, from: 5350, ph: "reef",
    experiences: ["diving", "remote", "light"], party: ["couples", "friends", "solo"],
    gateway: "Kaimana",
    summary: "Nine nights in green water where the soft coral grows in colours that look like a slider slipped.",
  },
  {
    slug: "whale-sharks-of-cenderawasih", title: "Whale Sharks of Cenderawasih",
    water: "cenderawasih", boat: "nusa-ombak", nights: 11, from: 6300, ph: "deep",
    experiences: ["diving", "family", "remote"], party: ["families", "couples", "friends"],
    gateway: "Nabire to Manokwari",
    summary: "Eleven nights in the one bay where whale sharks are residents, so guests get hours with them rather than minutes.",
  },
  {
    slug: "atoll-drift", title: "Atoll Drift", water: "wakatobi", boat: "bintang-laut",
    nights: 6, from: 3280, ph: "lagoon", experiences: ["diving", "wellness"],
    party: ["couples", "solo"], gateway: "Wangi-Wangi",
    summary: "Six nights drifting the Tukang Besi wall, with a reef top so healthy you will forget to look down.",
  },
  {
    slug: "the-spice-route", title: "The Spice Route", water: "halmahera",
    boat: "familia-satu", nights: 10, from: 5750, ph: "market",
    experiences: ["culture", "remote"], party: ["couples", "friends", "solo"],
    gateway: "Ternate",
    summary: "Ten nights through the original spice islands, with reefs that are genuinely still being surveyed.",
  },
  {
    slug: "three-nights-four-islands", title: "Three Nights, Four Islands", water: "komodo",
    boat: "layar-kecil", nights: 3, from: 1590, ph: "lagoon",
    experiences: ["family", "wellness"], party: ["families", "couples", "friends"],
    gateway: "Labuan Bajo",
    summary: "A short one, for people with a long flight home. Four anchorages, no crossings longer than two hours.",
  },
];

// ---------- Departures ----------

export const departures: Departure[] = [
  { id: "SFD-2608-MPA", trip: "manta-passage", boat: "familia-satu", start: "2026-08-22", nights: 7, cabinsLeft: 2, price: 3450, status: "limited", deposit: 0.25 },
  { id: "SFD-2609-TFK", trip: "the-four-kings", boat: "nusa-ombak", start: "2026-09-06", nights: 10, cabinsLeft: 5, price: 5900, status: "open", deposit: 0.25 },
  { id: "SFD-2609-WOS", trip: "weavers-of-solor", boat: "bintang-laut", start: "2026-09-14", nights: 8, cabinsLeft: 3, price: 4150, status: "open", deposit: 0.25 },
  { id: "SFD-2609-TVR", trip: "the-volcano-run", boat: "familia-satu", start: "2026-09-24", nights: 12, cabinsLeft: 1, price: 6750, status: "limited", deposit: 0.30 },
  { id: "SFD-2610-HHS", trip: "hammerhead-season", boat: "bintang-laut", start: "2026-10-04", nights: 9, cabinsLeft: 0, price: 5200, status: "waitlist", deposit: 0.25 },
  { id: "SFD-2610-LLE", trip: "lagoons-little-explorers", boat: "nusa-ombak", start: "2026-10-12", nights: 5, cabinsLeft: 4, price: 2680, status: "open", deposit: 0.25 },
  { id: "SFD-2610-TSR", trip: "the-spice-route", boat: "familia-satu", start: "2026-10-20", nights: 10, cabinsLeft: 4, price: 5750, status: "open", deposit: 0.25 },
  { id: "SFD-2611-MSL", trip: "misool-slowly", boat: "layar-kecil", start: "2026-11-02", nights: 7, cabinsLeft: 2, price: 4400, status: "limited", deposit: 0.30 },
  { id: "SFD-2611-SCC", trip: "soft-coral-country", boat: "familia-satu", start: "2026-11-15", nights: 9, cabinsLeft: 6, price: 5350, status: "open", deposit: 0.25 },
  { id: "SFD-2612-TNF", trip: "three-nights-four-islands", boat: "layar-kecil", start: "2026-12-04", nights: 3, cabinsLeft: 1, price: 1590, status: "limited", deposit: 0.25 },
  { id: "SFD-2612-TFK", trip: "the-four-kings", boat: "nusa-ombak", start: "2026-12-18", nights: 10, cabinsLeft: 0, price: 6400, status: "closed", deposit: 0.25 },
  { id: "SFD-2701-ADR", trip: "atoll-drift", boat: "bintang-laut", start: "2027-01-09", nights: 6, cabinsLeft: 5, price: 3280, status: "open", deposit: 0.25 },
  { id: "SFD-2702-WSC", trip: "whale-sharks-of-cenderawasih", boat: "nusa-ombak", start: "2027-02-06", nights: 11, cabinsLeft: 7, price: 6300, status: "open", deposit: 0.25 },
  { id: "SFD-2703-MPA", trip: "manta-passage", boat: "familia-satu", start: "2027-03-14", nights: 7, cabinsLeft: 8, price: 3450, status: "open", deposit: 0.25 },
  { id: "SFD-2704-TVR", trip: "the-volcano-run", boat: "familia-satu", start: "2027-04-02", nights: 12, cabinsLeft: 6, price: 6750, status: "open", deposit: 0.30 },
  { id: "SFD-2705-MSL", trip: "misool-slowly", boat: "layar-kecil", start: "2027-05-08", nights: 7, cabinsLeft: 3, price: 4400, status: "open", deposit: 0.30 },
];

// ---------- Articles ----------

export const articles: Article[] = [
  {
    slug: "reading-the-current", title: "Reading the Current", category: "Craft",
    dek: "Our cruise director has never used a dive computer to decide when to get in the water. She reads the surface instead.",
    author: "Ayu Prasetya", role: "Cruise director, Familia Satu",
    date: "2026-06-18", read: 8, ph: "deep", featured: true,
    tags: ["diving", "crew", "komodo"],
    body: [
      { t: "p", v: "There is a line of water off Batu Bolong that appears about forty minutes before slack. It is not dramatic. If you were not looking for it you would call it a shadow, or a patch where the wind sits differently on the surface." },
      { t: "h2", v: "What the table cannot know" },
      { t: "p", v: "Tide tables are computed for ports. They assume a coastline, a basin, a set of averages. What they cannot know is that a ridge sitting at right angles to the flow will hold a back-eddy for another twenty minutes." },
      { t: "quote", v: "The sea does not run late. Our arithmetic does." },
      { t: "p", v: "So the briefing on Familia Satu happens twice: once the night before, with the chart and the numbers, and once at the rail, ten minutes before we get in, with nothing but the surface to go on." },
    ],
  },
  {
    slug: "the-kitchen-on-a-swell", title: "The Kitchen on a Swell", category: "Kitchen",
    dek: "How Pak Rudi cooks for sixteen on a boat with no gimballed stove and a three-metre swell running.",
    author: "Rudi Hartawan", role: "Head cook, Familia Satu",
    date: "2026-05-29", read: 6, ph: "market", featured: false, tags: ["crew", "food", "banda"],
  },
  {
    slug: "a-reef-that-grew-on-lava", title: "A Reef That Grew on Lava", category: "Reefs",
    dek: "In 1988 Gunung Api erupted and buried the reef under rock. Thirty-eight years later it is the healthiest hard coral in the Banda Sea.",
    author: "Dr. Lila Moerdani", role: "Marine biologist, guest lecturer",
    date: "2026-05-11", read: 11, ph: "volcano", featured: true, tags: ["reefs", "banda", "science"],
    body: [
      { t: "p", v: "The lava reached the water on the north-west side of Gunung Api in May 1988 and kept going, down the slope, over everything." },
      { t: "h2", v: "Why it worked" },
      { t: "p", v: "Fresh volcanic rock is, from a coral larva\u2019s point of view, close to ideal: hard, clean, rough enough to grip, and utterly uncontested." },
      { t: "quote", v: "It is the only place I take students where the reef has a birthday." },
      { t: "p", v: "What you see now is a table-coral field running from three metres to past forty, dense enough that finding sand to put a camera down on is a genuine problem." },
    ],
  },
  {
    slug: "eleven-years-at-one-loom", title: "Eleven Years at One Loom", category: "Places",
    dek: "What changes, and what refuses to, in a Solor weaving village visited by the same boat every September.",
    author: "Ayu Prasetya", role: "Cruise director, Familia Satu",
    date: "2026-04-22", read: 9, ph: "village", featured: false, tags: ["culture", "alor", "community"],
  },
  {
    slug: "why-we-stopped-selling-fourteen-guests", title: "Why We Stopped Selling Fourteen Guests", category: "Familia",
    dek: "Familia Satu sleeps sixteen. For two seasons we sold fourteen, and the numbers were better. Here is why we changed back.",
    author: "Bimo Santoso", role: "Co-founder",
    date: "2026-03-30", read: 5, ph: "boat", featured: false, tags: ["familia", "business"],
  },
  {
    slug: "the-bagan-agreement", title: "The Bagan Agreement", category: "Conservation",
    dek: "The whale sharks of Kwatisore are protected by an arrangement nobody wrote down.",
    author: "Dr. Lila Moerdani", role: "Marine biologist, guest lecturer",
    date: "2026-03-08", read: 10, ph: "deep", featured: false, tags: ["conservation", "cenderawasih", "science"],
  },
  {
    slug: "night-watch", title: "Night Watch", category: "Craft",
    dek: "On the Banda crossing, guests are welcome on the 2am watch. Most who try it do it again the next night.",
    author: "Captain Yos Tanuwijaya", role: "Master, Bintang Laut",
    date: "2026-02-14", read: 7, ph: "night", featured: false, tags: ["sailing", "banda", "crew"],
  },
  {
    slug: "what-we-buy-in-the-market", title: "What We Buy in the Market", category: "Kitchen",
    dek: "A provisioning list from one Thursday in Labuan Bajo, and the reason there is no salmon on it.",
    author: "Rudi Hartawan", role: "Head cook, Familia Satu",
    date: "2026-01-26", read: 6, ph: "market", featured: false, tags: ["food", "sustainability", "komodo"],
  },
];

// ---------- Team ----------

export const team: TeamMember[] = [
  { slug: "bimo-santoso", name: "Bimo Santoso", role: "Co-founder", home: "Bira, South Sulawesi", ph: "portrait", note: "Grandson of a Konjo shipwright. Signed the loan for Familia Satu at 29 and still checks every hull himself." },
  { slug: "ratih-santoso", name: "Ratih Santoso", role: "Co-founder", home: "Labuan Bajo", ph: "portrait", note: "Ran the office out of a spare room for three years. Handles every charter enquiry personally." },
  { slug: "ayu-prasetya", name: "Ayu Prasetya", role: "Cruise director", home: "Labuan Bajo", ph: "portrait", note: "Learned the currents from her uncle's outrigger at fourteen. Has logged over four thousand dives." },
  { slug: "yos-tanuwijaya", name: "Captain Yos Tanuwijaya", role: "Master, Bintang Laut", home: "Ambon", ph: "portrait", note: "Twenty-two Banda crossings. Will change the day's plan for a good breeze." },
  { slug: "rudi-hartawan", name: "Rudi Hartawan", role: "Head cook", home: "Makassar", ph: "portrait", note: "Cooks for sixteen with no gimballed stove. Buys whatever the market had." },
  { slug: "lila-moerdani", name: "Dr. Lila Moerdani", role: "Marine biologist", home: "Bogor", ph: "portrait", note: "Joins four crossings a season as guest lecturer. Runs the reef-monitoring plots." },
];

// ---------- FAQ ----------

export const faq: FAQ[] = [
  { group: "Booking", q: "What is the difference between an open trip and a private charter?", a: "An open trip is a scheduled departure where you reserve a cabin and share the boat with other guests. A private charter is the whole boat, on your dates, with an itinerary we build with you." },
  { group: "Booking", q: "How much deposit do you take?", a: "Twenty-five percent of the cabin total to confirm your place, thirty percent on the twelve-night Banda crossings." },
  { group: "Booking", q: "What happens after I reserve?", a: "You get a booking reference immediately and an email within a few minutes. Someone from the office replies within one working day." },
  { group: "On board", q: "Do I need to be a certified diver?", a: "Not on most routes. Every itinerary works for confident snorkellers." },
  { group: "On board", q: "Is there wifi?", a: "Starlink on all four boats, and it mostly works." },
  { group: "On board", q: "What about children?", a: "Very welcome from four upwards, and two of our routes are built specifically around them." },
  { group: "Money & policy", q: "Which currencies can I pay in?", a: "USD, IDR, EUR, AUD and SGD." },
  { group: "Money & policy", q: "What is your cancellation policy?", a: "Full refund of the deposit up to ninety days out, fifty percent up to sixty days, and no refund inside sixty days." },
];

// ---------- Inclusions ----------

export const inclusions: Inclusions = {
  included: [
    "All meals, snacks and soft drinks",
    "Filtered water, tea and coffee, always on",
    "Cabin with private ensuite and hot water",
    "Up to four dives a day where the route allows",
    "Tanks, weights, guides and nitrox for certified divers",
    "Snorkelling gear, kayaks and paddleboards",
    "Airport transfers on embarkation and disembarkation days",
    "National park and marine conservation fees",
    "Starlink wifi",
  ],
  excluded: [
    "Flights to and from the gateway port",
    "Dive equipment rental (available on board)",
    "Alcohol — bring your own, no corkage",
    "Massage and spa treatments",
    "Travel and diving insurance (required)",
    "Crew gratuities, entirely at your discretion",
  ],
};

// ---------- Length buckets ----------

export const lengths: LengthBucket[] = [
  { slug: "short", label: "3 – 5 nights", min: 0, max: 5, note: "A long weekend" },
  { slug: "classic", label: "6 – 8 nights", min: 6, max: 8, note: "The classic week" },
  { slug: "long", label: "9 – 14 nights", min: 9, max: 99, note: "A real crossing" },
];

// ---------- Party options ----------

export const parties: PartyOption[] = [
  { slug: "couples", label: "Two of us", note: "Couples and pairs" },
  { slug: "families", label: "With children", note: "Families, 4 years up" },
  { slug: "friends", label: "A group of friends", note: "Four or more" },
  { slug: "solo", label: "On my own", note: "No single supplement" },
];

// ---------- Lookup helpers ----------

export function findWater(slug: string) { return waters.find((w) => w.slug === slug) ?? null; }
export function findBoat(slug: string) { return boats.find((b) => b.slug === slug) ?? null; }
export function findTrip(slug: string) { return trips.find((t) => t.slug === slug) ?? null; }
export function findDeparture(id: string) { return departures.find((d) => d.id === id) ?? null; }
export function findArticle(slug: string) { return articles.find((a) => a.slug === slug) ?? null; }
export function findExperience(slug: string) { return experiences.find((e) => e.slug === slug) ?? null; }

export function bodyFor(a?: Article | null) {
  if (a && a.body && a.body.length) return a.body;
  if (!a) return [];
  return [
    { t: "p", v: a.dek },
    { t: "h2", v: "From the boat" },
    { t: "p", v: "This piece is part of the Sea Familia journal, written by the people who are actually on the water — crew, cooks, captains and the biologists who join us as guest lecturers. We publish about twice a month, in between seasons and whenever somebody has something worth saying." },
    { t: "quote", v: "Nobody on this boat is a content producer. That is rather the point." },
    { t: "p", v: "If you would like the full piece as soon as it is edited, the familia letter goes out monthly and contains no marketing beyond the occasional note that a departure has opened up." },
  ];
}

export function filterTrips(filters: {
  water?: string;
  boat?: string;
  experience?: string;
  length?: string;
  party?: string;
  q?: string;
}) {
  return trips.filter((tr) => {
    if (filters.water && tr.water !== filters.water) return false;
    if (filters.boat && tr.boat !== filters.boat) return false;
    if (filters.experience && !tr.experiences.includes(filters.experience as never)) return false;
    if (filters.length) {
      const bucket = lengths.find((l) => l.slug === filters.length);
      if (bucket && (tr.nights < bucket.min || tr.nights > bucket.max)) return false;
    }
    if (filters.party && !tr.party.includes(filters.party as never)) return false;
    if (filters.q) {
      const needle = filters.q.toLowerCase();
      const hay = `${tr.title} ${tr.summary} ${findWater(tr.water)?.name ?? ""}`.toLowerCase();
      if (!hay.includes(needle)) return false;
    }
    return true;
  });
}

export function filterDepartures(query: { trip?: string, boat?: string, available?: boolean, water?: string, experience?: string } = {}) {
  let result = departures;
  if (query.trip) result = result.filter((d) => d.trip === query.trip);
  if (query.boat) result = result.filter((d) => d.boat === query.boat);
  if (query.available) result = result.filter((d) => d.status === "open" || d.status === "waitlist");
  if (query.water) {
    result = result.filter(d => {
      const trip = findTrip(d.trip);
      return trip && trip.water === query.water;
    });
  }
  if (query.experience) {
    result = result.filter(d => {
      const trip = findTrip(d.trip);
      return trip && trip.experiences.includes(query.experience as any);
    });
  }
  return result;
}
