/**
 * Photo existence resolution — the server-only half of the photo system.
 * Path/size constants live in lib/photo-paths.ts (safe for Client
 * Components); this file touches the filesystem and must never reach the
 * browser bundle.
 */
import 'server-only';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Resolves a public-relative path (as returned by photoPath.*) to itself if
 * the file actually exists under public/, or null otherwise.
 *
 * Replaces the original's client-side `onerror="this.style.display='none'"`
 * fallback (data.js:981-984): with zero real photography shot yet, every
 * image request would otherwise 404 in the browser AND make next/image's
 * optimizer log an error per image. Checking on the server means
 * PhotoSlot/PhotoPlate (components/media) can render just the .ph-*
 * gradient with zero network requests when a photo is absent — the
 * onError handler on the client stays only as a CDN-edge-case backstop.
 *
 * The client-facing contract from HANDOFF §9 is unchanged: drop a JPEG in
 * at the documented path and it appears, no code change — this function
 * just needs a server restart in dev to notice a newly-dropped file
 * (require cache on the directory listing is per-process, not per-request,
 * intentionally: re-`existsSync`-ing on every request for content that
 * essentially never changes at runtime is wasted I/O).
 */
const existsCache = new Map<string, boolean>();

export function photoIfExists(publicPath: string): string | null {
  let exists = existsCache.get(publicPath);
  if (exists === undefined) {
    exists = fs.existsSync(path.join(process.cwd(), 'public', publicPath));
    existsCache.set(publicPath, exists);
  }
  return exists ? publicPath : null;
}

/**
 * Resolves a photo per item, keyed by slug — for client-filtered listings
 * (destinations, journal search, etc.) whose Client Component can't import
 * this server-only module directly. The Server Component page resolves the
 * map up front and passes plain `string | null` values down as props,
 * which the client renders via PhotoPlate (components/media/photo-plate.tsx).
 */
export function resolvePhotoMap<T>(items: readonly T[], key: (item: T) => string, path: (item: T) => string): Record<string, string | null> {
  const out: Record<string, string | null> = {};
  for (const item of items) out[key(item)] = photoIfExists(path(item));
  return out;
}
