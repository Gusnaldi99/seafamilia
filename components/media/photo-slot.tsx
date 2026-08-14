/**
 * Real photography, once dropped into public/assets/media/photos/, sits on
 * top of the .ph placeholder beneath it — ported from data.js's `photo()` +
 * the `.ph`/`.img-slot` pair in styles/placeholders.css. Until a file
 * exists, `photoIfExists()` resolves to null server-side, so the gradient
 * plate renders alone with zero image requests (see lib/photo.ts).
 *
 * Server Component only (photoIfExists does a filesystem check via
 * `server-only`) — callers own the outer wrapper (aspect ratio, rounding,
 * bg-ink), matching the original's `<div class="relative aspect-[…] …">`
 * wrapping the `.ph` element rather than this component owning it, since
 * that aspect ratio differs per card type.
 */
import { photoIfExists } from '@/lib/photo';
import { PhotoPlate } from './photo-plate';
import type { PhVariant } from '@/lib/data/types';

interface PhotoSlotProps {
  ph: PhVariant;
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
}

export function PhotoSlot({ ph, src, alt, sizes, className, priority }: PhotoSlotProps) {
  // An empty src (e.g. a cabin rendered with no known boat slug) has no
  // candidate path to check — fs.existsSync('') resolves to the public/
  // directory itself and would wrongly report "exists".
  const resolved = src ? photoIfExists(src) : null;
  return <PhotoPlate ph={ph} src={resolved} alt={alt} sizes={sizes} className={className} priority={priority} />;
}
