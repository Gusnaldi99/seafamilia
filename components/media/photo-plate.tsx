/**
 * The universal half of PhotoSlot: renders the .ph gradient plate and
 * layers next/image on top of it once given an already-resolved src. Has
 * no `server-only` dependency (unlike PhotoSlot itself, which resolves
 * that src via a filesystem check) — safe to import from Client Components
 * too, which is the point: a client-filtered listing (destinations, journal
 * search, etc.) can't import PhotoSlot directly, but the page.tsx Server
 * Component that renders it can resolve the photo map up front and hand
 * plain `string | null` values down as props.
 */
import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { PhVariant } from '@/lib/data/types';

interface PhotoPlateProps {
  ph: PhVariant;
  src: string | null;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
}

export function PhotoPlate({ ph, src, alt, sizes, className, priority }: PhotoPlateProps) {
  return (
    <div className={cn('ph', `ph-${ph}`, 'absolute inset-0', className)}>
      {src ? <Image src={src} alt={alt} fill sizes={sizes} className="img-slot" priority={priority} /> : null}
    </div>
  );
}
