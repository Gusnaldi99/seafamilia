/**
 * Homepage hero video — sits on top of the `.ph-reef` gradient plate in
 * app/page.tsx, same layering `PhotoSlot` uses for photos: a server-side
 * `fs.existsSync` check gates whether real footage renders at all, so the
 * gradient alone still carries the hero with zero video requests if
 * `hero.mp4` is ever absent. Inlined here rather than added to lib/photo.ts
 * since there's exactly one video asset in the whole app — a parallel
 * `videoPath`/`lib/video.ts` system would be speculative for a single file.
 *
 * Reduced-motion is handled entirely by the existing global rule in
 * styles/base.css (`video { display: none }` under
 * `prefers-reduced-motion: reduce`) — no component-level logic needed; the
 * `.ph-reef` plate underneath simply shows through once the video is hidden.
 */
import fs from 'node:fs';
import path from 'node:path';

const SRC = '/assets/media/hero.mp4';
const POSTER = '/assets/media/hero-poster.svg';

export function HeroVideo() {
  const exists = fs.existsSync(path.join(process.cwd(), 'public', SRC));
  if (!exists) return null;

  return (
    <video
      className="absolute inset-0 h-full w-full object-cover"
      autoPlay
      muted
      loop
      playsInline
      preload="none"
      poster={POSTER}
      aria-label="Aerial view of the islands Sea Familia sails, Eastern Indonesia"
    >
      <source src={SRC} type="video/mp4" />
    </video>
  );
}
