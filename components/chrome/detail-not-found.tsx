/** Shared shape behind every detail segment's not-found.tsx — ported from
 * each detail page's `x-if="!record"` block. Each segment passes its own
 * copy; boat.html's version has no secondary CTA, hence it being optional. */
import Link from 'next/link';

export function DetailNotFound({
  title,
  body,
  primary,
  secondary,
}: {
  title: string;
  body: string;
  primary: { href: string; label: string };
  secondary?: { href: string; label: string };
}) {
  return (
    <section className="mx-auto max-w-2xl px-5 py-24 text-center sm:px-6 lg:py-32">
      <span className="wave-rule wave-rule-flame mx-auto block" aria-hidden="true" />
      <h1 className="mt-6 font-display text-3xl font-light text-ink-700 sm:text-4xl">{title}</h1>
      <p className="mt-4 text-base leading-relaxed text-ink/70">{body}</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href={primary.href}
          className="inline-flex h-12 items-center rounded-full bg-flame px-6 font-mark text-[12px] uppercase tracking-[0.14em] text-white transition hover:bg-flame-600"
        >
          {primary.label}
        </Link>
        {secondary ? (
          <Link
            href={secondary.href}
            className="inline-flex h-12 items-center rounded-full border border-ink/20 px-6 font-mark text-[12px] uppercase tracking-[0.14em] text-ink-700 transition hover:border-ink hover:bg-ink hover:text-white"
          >
            {secondary.label}
          </Link>
        ) : null}
      </div>
    </section>
  );
}
