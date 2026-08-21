/**
 * Content types, ported from assets/js/data.js + docs/HANDOFF.md §5.
 *
 * Slugs/enums that reference OTHER content (water, boat, experiences, party)
 * are typed as plain `string`, not literal unions of today's values — the
 * whole point of this layer is "swap the arrays for API responses and the
 * markup does not change" (HANDOFF §5). A literal union would violate that
 * the moment a 9th water or 5th experience is added. Referential integrity
 * (every trip.water resolves, etc.) is enforced by
 * lib/data/__tests__/integrity.test.ts instead, matching what
 * tools/check-data.js did for the static build.
 *
 * Five corrections made here against HANDOFF §5, verified directly against
 * data.js rather than trusting the doc (see the migration plan's Phase 3
 * notes): trips is 12 records not 13, articles is 8 not 7, Experience has no
 * `icon` field (icons are resolved by slug, see lib/photo's sibling icon
 * lookup), CabinType has a `ph` field HANDOFF omits, and there are 7 card
 * kinds (not 6) — team/faq/lengths/parties/inclusions are real content
 * HANDOFF never documented at all.
 */

/** One of the 12 placeholder-photography gradient variants (app.css .ph-*). */
export type PhVariant =
  | 'reef'
  | 'deep'
  | 'lagoon'
  | 'volcano'
  | 'sunset'
  | 'village'
  | 'jungle'
  | 'boat'
  | 'cabin'
  | 'market'
  | 'night'
  | 'portrait';

export type DepartureStatus = 'open' | 'limited' | 'waitlist' | 'closed';

/** ISO date, YYYY-MM-DD only — HANDOFF §5's global rule. Never localized. */
export type IsoDate = string;

export interface Experience {
  slug: string;
  name: string;
  ph: PhVariant;
  tagline: string;
  blurb: string;
  /** Section hides when empty/absent. */
  forWho?: string[];
  /** Section hides when empty/absent. */
  signature?: string[];
}

export interface Water {
  slug: string;
  name: string;
  /** Used in cards, chips, and footer/nav mirrors. */
  short: string;
  ph: PhVariant;
  /** Airport or port of embarkation. */
  gateway: string;
  /** Free text, e.g. "April – November". */
  season: string;
  /** Character of the sailing, e.g. "Short hops, calm nights". */
  crossing: string;
  /** Card copy, one sentence. */
  blurb: string;
  /** Detail-page copy, one paragraph. */
  story: string;
  /** Rendered as a numbered list of exactly 3. */
  highlights: [string, string, string];
  /** Anchorage names; also feeds Trip.route generation when a trip has none. */
  stops: string[];
  /** Experience slugs. Must resolve, or the discovery filter silently drops this water. */
  bestFor: string[];
}

export interface CabinType {
  /** Unique per boat; used in reserve's ?cabin= entry param. */
  code: string;
  name: string;
  deck: string;
  beds: string;
  occupancy: number;
  /** Drives guest-count validation in the reservation funnel. */
  maxOccupancy: number;
  /** Integer USD per person, catalogue rate for the boat. */
  price: number;
  /** Catalogue availability; real per-date availability overrides it (see Departure.cabins). */
  left: number;
  ph: PhVariant;
  features?: string[];
}

/**
 * One trip-length tier of a boat's private-charter rate card, priced as a
 * flat package for the whole trip rather than a nightly rate — the source
 * rate sheet prices "3D2N" as one figure for both nights together, and
 * longer trips are often cheaper per night than shorter ones (a long-charter
 * discount). Deriving a nightly rate from these would misrepresent that.
 */
export interface CharterRateTier {
  /** Exactly as the rate card labels it, e.g. "One Day Trip", "3D2N". */
  label: string;
  /** Nights aboard for this tier (0 for a same-day trip). */
  nights: number;
  /** Total package price in USD — one entry per Boat.charterRates.paxBands, same order/length. */
  prices: number[];
  /** Extra-bed surcharge, USD per extra person, for this tier. Absent where the rate card quotes none. */
  extraBedPerPerson?: number;
}

/** A boat's full private-charter rate card. Optional — only populated where the client's brochure includes one. */
export interface CharterRates {
  /** Pax-band labels, e.g. ["1–8 pax", "9–12 pax"]. Same order/length as every tier's `prices`. */
  paxBands: string[];
  tiers: CharterRateTier[];
  /** Per-person-per-day add-ons not tied to a specific tier, e.g. diving. */
  addOns?: { label: string; pricePerPersonPerDay: number }[];
}

export interface Boat {
  slug: string;
  name: string;
  type: string;
  ph: PhVariant;
  tagline: string;
  blurb: string;
  /** Unit-bearing display strings, e.g. "32 m". */
  length: string;
  beam: string;
  cruise: string;
  sails: string;
  built: number;
  refit: number;
  cabins: number;
  guests: number;
  crew: number;
  tenders: number;
  decks: number;
  /** Integer USD, per boat per day — charter step 1 and step 3. */
  charterDay: number;
  /** Full private-charter rate card (trip-length × pax-band), where the client has supplied one. charterDay always holds regardless. */
  charterRates?: CharterRates;
  facilities: string[];
  safety: string[];
  /** 4 image slots, 4:3. */
  gallery: PhVariant[];
  /** At least 2 grades. Not enforced by any test — a convention, not a hard rule. */
  cabinTypes: CabinType[];
  /** Water slugs this boat operates in — must resolve. Drives the charter water-picker. */
  waters: string[];
  /** True only for boats that carry dive gear/guides. Diving is never offered on a boat where this is false. */
  offersDiving: boolean;
  /** What a cabin fare on this boat covers. A Trip may override either with its own included/excluded array. */
  included: string[];
  excluded: string[];
}

export interface RouteDay {
  /** A single day ("3") or a span ("2–3") — string, not number. */
  day: string;
  title: string;
  text: string;
  /** Only present on routes synthesized by routeFor() from Water.stops. */
  provisional?: boolean;
}

export type PartySlug = 'couples' | 'families' | 'friends' | 'solo';

export interface Trip {
  slug: string;
  title: string;
  /** Water slug — must resolve. */
  water: string;
  /** Boat slug — must resolve. */
  boat: string;
  nights: number;
  /** Integer USD, lowest cabin grade. */
  from: number;
  ph: PhVariant;
  /** Experience slugs — drives the experience filter. */
  experiences: string[];
  party: PartySlug[];
  /** e.g. "Labuan Bajo" (round trip) or "Ambon to Saumlaki" (point-to-point). */
  gateway: string;
  summary: string;
  story: string;
  /** Rendered as a numbered list of exactly 3. */
  highlights: [string, string, string];
  /** Default false. */
  editorPick?: boolean;
  /**
   * If absent, routeFor() builds an outline from the water's `stops` and
   * flags it provisional — the itinerary page then shows an "outline only"
   * note. Never renders blank.
   */
  route?: RouteDay[];
  /** Overrides the brand-level default Inclusions for this trip only. */
  included?: string[];
  /** Overrides the brand-level default Inclusions for this trip only. */
  excluded?: string[];
}

export interface Departure {
  /** SFD-YYMM-XXX, shown to guests. */
  id: string;
  /** Trip slug — must resolve. */
  trip: string;
  /** Boat slug — may differ from the trip's default boat. */
  boat: string;
  start: IsoDate;
  nights: number;
  /** Caps the derived cabin inventory (see the reserve feature's cabin derivation). */
  cabinsLeft: number;
  /** Integer USD per person, base grade, this date. */
  price: number;
  status: DepartureStatus;
  /** 0–1 float, e.g. 0.25. */
  deposit: number;
  /**
   * Open item from HANDOFF §5: production should send real per-date cabin
   * inventory here. Until then it's derived from the boat's catalogue
   * grades capped by cabinsLeft (see features/reserve/cabins.ts once built).
   */
  cabins?: Array<{ code: string; left: number; price: number }>;
}

export type ArticleBlockType = 'p' | 'h2' | 'quote';

export interface ArticleBlock {
  t: ArticleBlockType;
  v: string;
}

export interface Article {
  slug: string;
  title: string;
  category: string;
  /** One-sentence deck/summary. */
  dek: string;
  /** Plain name string, not a team slug — see teamMemberByName in lib/queries.ts. */
  author: string;
  role: string;
  date: IsoDate;
  /** Minutes. */
  read: number;
  ph: PhVariant;
  /** Two featured pieces head the journal. Default false. */
  featured?: boolean;
  /** Tags matching a water or experience slug drive the "where this happens" block. */
  tags?: string[];
  /** If absent, bodyFor() returns a placeholder body built from the dek. */
  body?: ArticleBlock[];
}

export interface TeamMember {
  slug: string;
  name: string;
  role: string;
  home: string;
  ph: PhVariant;
  note: string;
}

export interface FaqItem {
  group: string;
  q: string;
  a: string;
}

export type LengthSlug = 'short' | 'classic' | 'long';

export interface LengthBucket {
  slug: LengthSlug;
  label: string;
  min: number;
  max: number;
  note: string;
}

export interface PartyOption {
  slug: PartySlug;
  label: string;
  note: string;
}
