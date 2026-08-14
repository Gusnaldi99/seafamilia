/** The journal index's featured-pair layout — bigger than ArticleCard, with
 * the title/dek/byline overlaid on the image rather than below it. Ported
 * from journal.html's featured section (inline markup, not one of
 * data.js's cards.* renderers — the original never factored this one out
 * either). */
import Link from 'next/link';
import { DateLabel } from '@/components/providers/locale-provider';
import { PhotoSlot } from '@/components/media/photo-slot';
import { CardChip } from './shared';
import { photoPath, PHOTO_SIZES } from '@/lib/photo-paths';
import { routes } from '@/lib/routes';
import type { Article } from '@/lib/data/types';

export function FeaturedArticleCard({ article }: { article: Article }) {
  return (
    <Link href={routes.article(article.slug)} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-ink">
        <PhotoSlot
          ph={article.ph}
          src={photoPath.article(article.slug)}
          alt={article.title}
          sizes={PHOTO_SIZES.articleCard}
          className="transition-transform duration-700 ease-swell group-hover:scale-[1.04]"
        />
        <div className="scrim absolute inset-0" aria-hidden="true" />
        <div className="absolute inset-x-5 bottom-5 lg:inset-x-7 lg:bottom-7">
          <CardChip>{article.category}</CardChip>
          <h2 className="mt-4 font-display text-2xl leading-tight text-white lg:text-3xl">{article.title}</h2>
          <p className="mt-2.5 max-w-lg text-sm leading-relaxed text-white/85">{article.dek}</p>
          <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 font-mark text-[10px] uppercase tracking-[0.14em] text-white/70">
            <span>{article.author}</span>
            <span aria-hidden="true">·</span>
            <DateLabel iso={article.date} />
            <span aria-hidden="true">·</span>
            <span>{article.read} min read</span>
          </p>
        </div>
      </div>
    </Link>
  );
}
