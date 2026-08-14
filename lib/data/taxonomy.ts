import type { Inclusions, LengthBucket, PartyOption } from './types';

// Ported verbatim from assets/js/data.js §5/§9. Used by every trip filter in
// the product (listings, guided discovery) and by the cabin-fare summary.

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

/** What a cabin fare covers, brand-level default. A Trip may override either
 * list with its own included/excluded array (see Trip.included/excluded). */
export const inclusions: Inclusions = {
  included: [
    'All meals, snacks and soft drinks',
    'Filtered water, tea and coffee, always on',
    'Cabin with private ensuite and hot water',
    'Up to four dives a day where the route allows',
    'Tanks, weights, guides and nitrox for certified divers',
    'Snorkelling gear, kayaks and paddleboards',
    'Airport transfers on embarkation and disembarkation days',
    'National park and marine conservation fees',
    'Starlink wifi',
  ],
  excluded: [
    'Flights to and from the gateway port',
    'Dive equipment rental (available on board)',
    'Alcohol — bring your own, no corkage',
    'Massage and spa treatments',
    'Travel and diving insurance (required)',
    'Crew gratuities, entirely at your discretion',
  ],
};
