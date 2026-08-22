import type { LengthBucket, PartyOption } from './types';

// Ported verbatim from assets/js/data.js §5/§9. Used by every trip filter in
// the product (listings, guided discovery).
// Fare inclusions/exclusions moved to per-boat data (see Boat.included /
// Boat.excluded in lib/data/boats.ts) since the two boats' fares differ.

/** Length buckets used by every trip filter in the product. */
export const lengths: LengthBucket[] = [
  { slug: 'short', label: '3 – 5 nights', min: 0, max: 5, note: 'A long weekend' },
  { slug: 'classic', label: '6 – 8 nights', min: 6, max: 8, note: 'The classic week' },
  { slug: 'long', label: '9 – 14 nights', min: 9, max: 99, note: 'A real crossing' },
];

export const parties: PartyOption[] = [
  { slug: 'couples', label: 'Two of us', note: 'Couples and pairs' },
  { slug: 'families', label: 'With children', note: 'Families, 4 years up' },
  { slug: 'friends', label: 'A group of friends', note: 'Four or more' },
  { slug: 'solo', label: 'On my own', note: 'No single supplement' },
];
