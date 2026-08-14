/** Discovery card — journal article. Ported from data.js's
 * `cards.article()`. */
import Link from 'next/link';
import { DateLabel } from '@/components/providers/locale-provider';
import { PhotoSlot } from '@/components/media/photo-slot';
import { CardChip, MetaRow } from './shared';
import { photoPath, PHOTO_SIZES } from '@/lib/photo-paths';
import { routes } from '@/lib/routes';
import { cn } from '@/lib/utils';
import type { Article } from '@/lib/data/types';

export function ArticleCard({ article, tall }: { article: Article; tall?: boolean }) {
  return (
    <Link href={routes.article(article.slug)} className="group block">
      <div className={cn('relative overflow-hidden rounded-2xl bg-ink', tall ? 'aspect-[4/5]' : 'aspect-[16/10]')}>
        <PhotoSlot
          ph={article.ph}
          src={photoPath.article(article.slug)}
          alt={article.title}
          sizes={PHOTO_SIZES.articleCard}
          className="transition-transform duration-700 ease-swell group-hover:scale-[1.04]"
        />
        <div className="absolute left-3 top-3">
          <CardChip>{article.category}</CardChip>
        </div>
      </div>
      <div className="pt-4">
        <h3 className="font-display text-xl leading-snug text-ink-700 transition-colors group-hover:text-flame-600">
          {article.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink/70">{article.dek}</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-mist-700">
          <MetaRow items={[article.author, <DateLabel key="date" iso={article.date} />, `${article.read} min read`]} />
        </div>
      </div>
    </Link>
  );
}
