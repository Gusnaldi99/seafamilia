import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArticleCard } from '@/components/cards/article-card';
import { TripCard } from '@/components/cards/trip-card';
import { PhotoSlot } from '@/components/media/photo-slot';
import { DateLabel } from '@/components/providers/locale-provider';
import { CopyLinkButton } from './copy-link-button';
import { PHOTO_SIZES, photoPath } from '@/lib/photo-paths';
import { articleBySlug, bodyFor, experienceBySlug, filterTrips, teamMemberByName, tripsInWater, waterBySlug } from '@/lib/queries';
import { routes } from '@/lib/routes';
import { articles, type Trip } from '@/lib/data';

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<'/journal/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const article = articleBySlug(slug);
  if (!article) return {};
  return { title: article.title, description: article.dek };
}

export default async function ArticleDetailPage({ params }: PageProps<'/journal/[slug]'>) {
  const { slug } = await params;
  const article = articleBySlug(slug);
  if (!article) notFound();

  const body = bodyFor(article);
  const author = teamMemberByName(article.author);
  const authorNote = author?.note ?? 'Writes for the Sea Familia journal from on board.';

  const sameCat = articles.filter((x) => x.slug !== article.slug && x.category === article.category);
  const sameTag = articles.filter(
    (x) => x.slug !== article.slug && !sameCat.some((s) => s.slug === x.slug) && (x.tags ?? []).some((tg) => (article.tags ?? []).includes(tg))
  );
  const related = [...sameCat, ...sameTag].slice(0, 3);

  const tags = article.tags ?? [];
  const byWater = tags.map((tg) => waterBySlug(tg)).filter((w) => w !== undefined);
  const byExp = tags.map((tg) => experienceBySlug(tg)).filter((e) => e !== undefined);
  const seen = new Set<string>();
  const relatedTrips: Trip[] = [];
  for (const w of byWater) {
    for (const t of tripsInWater(w.slug)) {
      if (!seen.has(t.slug)) {
        seen.add(t.slug);
        relatedTrips.push(t);
      }
    }
  }
  for (const e of byExp) {
    for (const t of filterTrips({ experience: e.slug })) {
      if (!seen.has(t.slug)) {
        seen.add(t.slug);
        relatedTrips.push(t);
      }
    }
  }
  const relatedTripsSliced = relatedTrips.slice(0, 3);

  return (
    <>
      <article>
        <header className="border-b border-sand-300 bg-sand">
          <div className="mx-auto max-w-3xl px-5 pb-10 pt-8 sm:px-6 lg:pb-14 lg:pt-12">
            <nav aria-label="Breadcrumb" className="font-mark text-[11px] uppercase tracking-[0.16em] text-mist-700">
              <Link href={routes.home()} className="hover:text-flame-600">
                Home
              </Link>
              <span className="px-2 text-mist-300" aria-hidden="true">
                /
              </span>
              <Link href={routes.journal()} className="hover:text-flame-600">
                Journal
              </Link>
              <span className="px-2 text-mist-300" aria-hidden="true">
                /
              </span>
              <Link href={routes.journal({ category: article.category })} className="text-ink-700 hover:text-flame-600">
                {article.category}
              </Link>
            </nav>

            <h1 className="mt-8 font-display text-4xl font-light leading-[1.06] tracking-tight text-ink-700 sm:text-5xl">{article.title}</h1>
            <p className="mt-5 font-display text-lg font-light leading-relaxed text-ink/80 sm:text-xl">{article.dek}</p>

            <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3 border-t border-sand-300 pt-6">
              <div className="arch relative h-12 w-11 shrink-0 overflow-hidden bg-ink">
                {author ? <PhotoSlot ph="portrait" src={photoPath.team(author.slug)} alt={article.author} sizes={PHOTO_SIZES.searchRow} /> : null}
              </div>
              <div className="min-w-0">
                <p className="text-sm text-ink-700">{article.author}</p>
                <p className="font-mark text-[10px] uppercase tracking-[0.14em] text-mist-700">{article.role}</p>
              </div>
              <span className="hidden h-8 w-px bg-sand-300 sm:block" />
              <p className="font-mark text-[10px] uppercase tracking-[0.14em] text-mist-700">
                <DateLabel iso={article.date} long />
                <span aria-hidden="true"> · </span>
                <span>{article.read} min read</span>
              </p>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-5xl px-5 sm:px-6">
          <figure className="pt-8 lg:pt-12">
            <div className="relative aspect-[16/9] overflow-hidden rounded-3xl bg-ink">
              <PhotoSlot ph={article.ph} src={photoPath.article(article.slug)} alt={article.title} sizes={PHOTO_SIZES.articleLead} />
            </div>
            <figcaption className="mt-3 text-xs leading-relaxed text-ink/55">
              {article.title} — photographed on board by the crew. Image slot: 16:9, served responsive.
            </figcaption>
          </figure>
        </div>

        <div className="mx-auto max-w-3xl px-5 py-12 sm:px-6 lg:py-16">
          <div className="prose prose-familia max-w-none prose-headings:font-display prose-headings:font-light prose-headings:tracking-tight prose-p:leading-relaxed prose-p:text-[1.0625rem]">
            {body.map((block, i) => {
              if (block.t === 'p') return <p key={i} className={i === 0 ? 'dropcap' : undefined}>{block.v}</p>;
              if (block.t === 'h2') return <h2 key={i}>{block.v}</h2>;
              return (
                <blockquote key={i} className="not-prose my-9">
                  <p className="pull-quote">{block.v}</p>
                </blockquote>
              );
            })}
          </div>

          {tags.length ? (
            <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-sand-300 pt-6">
              <span className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Filed under</span>
              {tags.map((tag) => (
                <Link
                  key={tag}
                  href={routes.journal({ q: tag })}
                  className="rounded-full border border-sand-300 px-3 py-1.5 font-mark text-[10px] uppercase tracking-[0.12em] text-ink-700 transition hover:border-mist"
                >
                  {tag}
                </Link>
              ))}
            </div>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Share</span>
            <CopyLinkButton />
            <a
              href={`mailto:?subject=${encodeURIComponent(article.title)}`}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-sand-300 px-4 font-mark text-[11px] uppercase tracking-[0.12em] text-ink-700 transition hover:border-mist"
            >
              Email it
            </a>
          </div>
        </div>
      </article>

      <section className="border-y border-sand-300 bg-sand">
        <div className="mx-auto max-w-3xl px-5 py-12 sm:px-6">
          <div className="flex flex-col gap-5 sm:flex-row">
            <div className="arch-soft relative h-40 w-32 shrink-0 overflow-hidden bg-ink">
              {author ? <PhotoSlot ph="portrait" src={photoPath.team(author.slug)} alt={article.author} sizes={PHOTO_SIZES.portrait} /> : null}
            </div>
            <div>
              <p className="font-mark text-[10px] uppercase tracking-[0.16em] text-flame">Written by</p>
              <h2 className="mt-2 font-display text-2xl text-ink-700">{article.author}</h2>
              <p className="mt-0.5 font-mark text-[11px] uppercase tracking-[0.14em] text-mist-700">{article.role}</p>
              <p className="mt-3 text-sm leading-relaxed text-ink/75">{authorNote}</p>
              <Link
                href={`${routes.ourStory()}#familia`}
                className="mt-4 inline-flex items-center gap-2 font-mark text-[11px] uppercase tracking-[0.16em] text-flame-600 underline underline-offset-4"
              >
                Meet the rest of the familia
              </Link>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 ? (
        <section className="mx-auto max-w-8xl px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="font-display text-2xl font-light text-ink-700 sm:text-3xl">Related stories</h2>
            <Link href={routes.journal()} className="group inline-flex items-center gap-2 font-mark text-[11px] uppercase tracking-[0.18em] text-ink-700 hover:text-flame-600">
              The whole journal
            </Link>
          </div>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {related.map((r) => (
              <ArticleCard key={r.slug} article={r} />
            ))}
          </div>
        </section>
      ) : null}

      {relatedTripsSliced.length > 0 ? (
        <section className="border-t border-sand-300 bg-ink text-white">
          <div className="mx-auto max-w-8xl px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
            <div className="max-w-xl">
              <span className="wave-rule wave-rule-light block" aria-hidden="true" />
              <p className="mt-5 font-mark text-eyebrow uppercase text-mist-300">Where this happens</p>
              <h2 className="mt-4 font-display text-3xl font-light leading-tight tracking-tight sm:text-4xl">You can go and see it</h2>
              <p className="mt-4 text-base leading-relaxed text-white/75">
                Everything in this piece happened on a route we still sail. Here are the ones it belongs to.
              </p>
            </div>
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {relatedTripsSliced.map((t) => (
                <div key={t.slug} className="rounded-2xl bg-white p-1">
                  <TripCard trip={t} />
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
