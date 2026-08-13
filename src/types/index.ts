/* ============================================================================
   Sea Familia — Provisional TypeScript interfaces
   Derived from the existing static data layer (data.js).
   Marked provisional until backend OpenAPI docs are available.
   ============================================================================ */

// ---------- Core Enums / Unions ----------

export type DepartureStatus = "open" | "limited" | "waitlist" | "closed";
export type PartyType = "couples" | "families" | "friends" | "solo";
export type ExperienceSlug =
  | "diving"
  | "family"
  | "remote"
  | "culture"
  | "wellness"
  | "light";
export type PlaceholderVariant =
  | "reef"
  | "deep"
  | "lagoon"
  | "volcano"
  | "sunset"
  | "village"
  | "jungle"
  | "boat"
  | "cabin"
  | "market"
  | "night"
  | "portrait";

// ---------- Experience ----------

export interface Experience {
  slug: ExperienceSlug;
  name: string;
  ph: PlaceholderVariant;
  tagline: string;
  blurb: string;
  forWho: string[];
  signature: string[];
}

// ---------- Water (Destination) ----------

export interface Water {
  slug: string;
  name: string;
  short: string;
  ph: PlaceholderVariant;
  gateway: string;
  season: string;
  crossing: string;
  blurb: string;
  story: string;
  highlights: string[];
  stops: string[];
  bestFor: ExperienceSlug[];
}

// ---------- Cabin Type ----------

export interface CabinType {
  code: string;
  name: string;
  deck: string;
  beds: string;
  occupancy: number;
  maxOccupancy: number;
  price: number;
  left: number;
  ph: PlaceholderVariant;
  features: string[];
}

// ---------- Boat ----------

export interface Boat {
  slug: string;
  name: string;
  type: string;
  ph: PlaceholderVariant;
  tagline: string;
  blurb: string;
  length: string;
  beam: string;
  built: number;
  refit: number;
  cabins: number;
  guests: number;
  crew: number;
  cruise: string;
  tenders: number;
  decks: number;
  sails: string;
  charterDay: number;
  facilities: string[];
  safety: string[];
  gallery: PlaceholderVariant[];
  cabinTypes: CabinType[];
}

// ---------- Route Day ----------

export interface RouteDay {
  day: string;
  title: string;
  text: string;
}

// ---------- Trip ----------

export interface Trip {
  slug: string;
  title: string;
  water: string;
  boat: string;
  nights: number;
  from: number;
  ph: PlaceholderVariant;
  experiences: ExperienceSlug[];
  party: PartyType[];
  editorPick?: boolean;
  gateway: string;
  summary: string;
  story?: string;
  highlights?: string[];
  route?: RouteDay[];
}

// ---------- Departure ----------

export interface Departure {
  id: string;
  trip: string;
  boat: string;
  start: string; // ISO date string "YYYY-MM-DD"
  nights: number;
  cabinsLeft: number;
  price: number;
  status: DepartureStatus;
  deposit: number; // fraction, e.g. 0.25
}

// ---------- Article ----------

export interface ArticleBodyBlock {
  t: "p" | "h2" | "quote";
  v: string;
}

export interface Article {
  slug: string;
  title: string;
  category: string;
  dek: string;
  author: string;
  role: string;
  date: string; // ISO date string
  read: number; // estimated reading time in minutes
  ph: PlaceholderVariant;
  featured: boolean;
  tags: string[];
  body?: ArticleBodyBlock[];
}

// ---------- Team ----------

export interface TeamMember {
  slug: string;
  name: string;
  role: string;
  home: string;
  ph: PlaceholderVariant;
  note: string;
}

// ---------- FAQ ----------

export interface FAQ {
  group: string;
  q: string;
  a: string;
}

// ---------- Inclusions ----------

export interface Inclusions {
  included: string[];
  excluded: string[];
}

// ---------- Length bucket ----------

export interface LengthBucket {
  slug: string;
  label: string;
  min: number;
  max: number;
  note: string;
}

// ---------- Party option ----------

export interface PartyOption {
  slug: PartyType;
  label: string;
  note: string;
}

// ---------- Currency ----------

export interface CurrencyConfig {
  code: string;
  symbol: string;
  rate: number;
  decimals: number;
  locale: string;
}

// ---------- Booking (provisional) ----------

export interface BookingRequest {
  departureId: string;
  cabinCode: string;
  guestCount: number;
  guests: GuestInfo[];
}

export interface GuestInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  nationality?: string;
  dateOfBirth?: string;
  dietaryNotes?: string;
  diveCert?: string;
}

// ---------- Charter Request (provisional) ----------

export interface CharterRequest {
  boat: string;
  startDate: string;
  endDate: string;
  guestCount: number;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  experiences?: ExperienceSlug[];
  waters?: string[];
}
