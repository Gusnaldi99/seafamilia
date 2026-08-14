/** The site's plain "Home / X" breadcrumb — every listing/detail page uses
 * this exact styling, ported verbatim rather than shadcn's Breadcrumb
 * primitive (a heavier ol/li structure with a chevron separator that
 * doesn't match this brand's flat, uppercase-tracked, slash-separated
 * style). */
import Link from 'next/link';
import { routes } from '@/lib/routes';

export function PageBreadcrumb({ label }: { label: string }) {
  return (
    <nav aria-label="Breadcrumb" className="font-mark text-[11px] uppercase tracking-[0.16em] text-mist-700">
      <Link href={routes.home()} className="hover:text-flame-600">
        Home
      </Link>
      <span className="px-2 text-mist-300" aria-hidden="true">
        /
      </span>
      <span className="text-ink-700">{label}</span>
    </nav>
  );
}
