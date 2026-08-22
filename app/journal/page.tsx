import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { PageBreadcrumb } from '@/components/chrome/page-breadcrumb';
import { ArticleCard } from '@/components/cards/article-card';
import { FeaturedArticleCard } from '@/components/cards/featured-article-card';
import { PhotoSlot } from '@/components/media/photo-slot';
import { JournalIndex } from './journal-index';
import { photoPath, PHOTO_SIZES } from '@/lib/photo-paths';
import { routes } from '@/lib/routes';
import { articles, team } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Journal',
  description:
    'Written on the boat, mostly — by the crew, the cook, the captain and the marine biologist who joins four crossings a season.',
};

const WRITER_NAMES = ['Ayu Prasetya', 'Captain Yos Tanuwijaya', 'Rudi Hartawan', 'Dr. Lila Moerdani'];
const writers = team.filter((p) => WRITER_NAMES.includes(p.name));

const featuredCards = Object.fromEntries(
  articles.filter((a) => a.featured).map((a) => [a.slug, <FeaturedArticleCard key={a.slug} article={a} />])
);
const articleCards = Object.fromEntries(articles.map((a) => [a.slug, <ArticleCard key={a.slug} article={a} />]));

export default function JournalPage() {
  return (
    <>
      <section className="border-b border-sand-300 bg-sand">
        <div className="mx-auto max-w-8xl px-5 pb-12 pt-8 sm:px-6 lg:px-8 lg:pb-16 lg:pt-12">
          <PageBreadcrumb label="Journal" />
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-end lg:gap-16">
            <div>
              <p className="font-mark text-eyebrow uppercase text-flame">Journal</p>
              <h1 className="mt-4 font-display text-4xl font-light leading-[1.06] tracking-tight text-ink-700 sm:text-5xl lg:text-6xl">
                Written on the boat,
                <br className="hidden sm:block" /> mostly
              </h1>
            </div>
            <p className="text-base leading-relaxed text-ink/70">
              By the crew, the cook, the captain and the marine biologist who joins four crossings a
              season. About twice a month, whenever somebody has something worth saying. Nobody here
              is a content producer.
            </p>
          </div>
        </div>
      </section>

      <Suspense fallback={<div className="mx-auto max-w-8xl px-5 py-12 sm:px-6 lg:px-8 lg:py-16" />}>
        <JournalIndex featuredCards={featuredCards} articleCards={articleCards} />
      </Suspense>

      <section className="border-t border-sand-300 bg-sand">
        <div className="mx-auto max-w-8xl px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
            <div>
              <span className="wave-rule wave-rule-flame block" aria-hidden="true" />
              <h2 className="mt-5 font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl">
                Who writes this
              </h2>
              <p className="mt-4 text-base leading-relaxed text-ink/70">
                Four regular contributors, none of whom were hired to write. Ayu reads currents, Yos
                crosses the Banda Sea, Rudi feeds twelve people off a market stall, and Lila counts
                coral.
              </p>
              <Link
                href={`${routes.ourStory()}#familia`}
                className="mt-6 inline-flex items-center gap-2 font-mark text-[11px] uppercase tracking-[0.16em] text-flame-600 underline underline-offset-4"
              >
                Meet the familia
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {writers.map((p) => (
                <div key={p.slug} className="flex gap-4 rounded-2xl bg-white p-4">
                  <div className="arch relative h-16 w-14 shrink-0 overflow-hidden bg-ink">
                    <PhotoSlot ph={p.ph} src={photoPath.team(p.slug)} alt={p.name} sizes={PHOTO_SIZES.portrait} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-display text-base leading-tight text-ink-700">{p.name}</p>
                    <p className="mt-0.5 font-mark text-[10px] uppercase tracking-[0.12em] text-flame">{p.role}</p>
                    <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-ink/65">{p.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
