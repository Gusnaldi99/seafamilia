/**
 * Photo path/size constants — split out from lib/photo.ts so Client
 * Components can import them directly. lib/photo.ts opens with `import
 * 'server-only'`, and that guard applies to the whole module: even
 * importing a harmless constant from it drags the guard into the client
 * bundle and fails the build. Only the actual filesystem check
 * (photoIfExists/resolvePhotoMap) needs to stay server-only.
 */

/** Ported from assets/js/data.js's `photoPath` object (§11) and HANDOFF
 * §9's asset manifest. The public path keeps the `/assets/media/...`
 * prefix rather than a shorter `/media/...` specifically so HANDOFF §9's
 * path table — a contract with whoever shoots the photography — stays
 * byte-identical. */
export const photoPath = {
  trip: (slug: string) => `/assets/media/photos/trips/${slug}.jpg`,
  boat: (slug: string) => `/assets/media/photos/boats/${slug}.jpg`,
  boatGallery: (slug: string, i: number) => `/assets/media/photos/boats/${slug}-${i + 1}.jpg`,
  water: (slug: string) => `/assets/media/photos/waters/${slug}.jpg`,
  article: (slug: string) => `/assets/media/photos/articles/${slug}.jpg`,
  experience: (slug: string) => `/assets/media/photos/experiences/${slug}.jpg`,
  team: (slug: string) => `/assets/media/photos/team/${slug}.jpg`,
  cabin: (boatSlug: string, code: string) => `/assets/media/photos/cabins/${boatSlug}-${code}.jpg`,
} as const;

/** `sizes` presets for next/image, derived from HANDOFF §9's asset manifest
 * and the grid definitions each card type renders in. */
export const PHOTO_SIZES = {
  hero: '100vw',
  tripCard: '(min-width: 1280px) 26rem, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw',
  boatCard: '(min-width: 640px) 45vw, 92vw',
  waterCard: '(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 80vw',
  articleCard: '(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw',
  articleLead: '(min-width: 1280px) 60rem, 100vw',
  experienceCard: '(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw',
  cabinThumb: '(min-width: 640px) 8rem, 6rem',
  departureThumb: '(min-width: 640px) 8rem, 100vw',
  gallery: '(min-width: 1024px) 25vw, 50vw',
  portrait: '(min-width: 1024px) 20vw, 45vw',
  searchRow: '4rem',
} as const;

/** The five one-off hero/section photos with no content record to key a
 * slug off — literal paths, ported from tools/check-pages.js's
 * INTENTIONALLY_ABSENT set. */
export const LITERAL_PHOTOS = {
  notFound: '/assets/media/photos/404.jpg',
  charter: '/assets/media/photos/charter.jpg',
  error: '/assets/media/photos/error.jpg',
  ourStory: '/assets/media/photos/our-story.jpg',
  ourStoryFounding: '/assets/media/photos/our-story-founding.jpg',
} as const;
