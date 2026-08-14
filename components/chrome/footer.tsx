/**
 * Ported from partials/footer.html. The Passages/Waters/charter-boat link
 * columns are generated from the typed data modules instead of the
 * original's hand-duplicated markup (HANDOFF §5 flagged that duplication as
 * a manual-sync hazard) — everything else here is a plain Server Component,
 * the newsletter form being the only interactive island.
 */
import Link from 'next/link';
import { boats, lengths, waters } from '@/lib/data';
import { routes } from '@/lib/routes';
import { NewsletterForm } from './newsletter-form';

const CHARTER_BOAT_SLUGS = ['familia-satu', 'nusa-ombak'];
const LINK_CLASSNAME = 'text-sm text-white/80 transition hover:text-white';
const LEGAL_LINK_CLASSNAME = 'font-mark text-[11px] uppercase tracking-[0.16em] text-white/60 transition hover:text-white';

export function Footer() {
  const charterBoats = CHARTER_BOAT_SLUGS.map((slug) => boats.find((b) => b.slug === slug)).filter(
    (b): b is (typeof boats)[number] => b !== undefined
  );

  return (
    <footer className="bg-ink text-white">
      <div className="border-b border-white/10">
        <div className="mx-auto grid max-w-8xl gap-10 px-5 py-14 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:px-8 lg:py-20">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element -- static brand asset, not content photography (see lib/photo.ts) */}
            <img
              src="/assets/logo/logo-light.png"
              alt="Sea Familia"
              width={120}
              height={118}
              loading="lazy"
              className="h-24 w-auto opacity-95"
            />
            <p className="mt-6 max-w-md font-display text-2xl leading-snug text-white/90 sm:text-3xl">
              Four boats, one family, and the eastern half of Indonesia.
            </p>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/60">
              We started with one phinisi built in Bira and a loan nobody sensible would have given us. The
              boats have multiplied. The crew list has barely changed.
            </p>
          </div>

          <NewsletterForm />
        </div>
      </div>

      <div className="mx-auto max-w-8xl px-5 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div>
            <h3 className="font-mark text-[11px] uppercase tracking-[0.2em] text-white/50">Passages</h3>
            <ul className="mt-4 space-y-2.5">
              {lengths.map((l) => (
                <li key={l.slug}>
                  <Link href={routes.destinations({ length: l.slug })} className={LINK_CLASSNAME}>
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={routes.destinations()} className={LINK_CLASSNAME}>
                  All itineraries
                </Link>
              </li>
              <li>
                <Link href={routes.departures()} className={LINK_CLASSNAME}>
                  Departure calendar
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-mark text-[11px] uppercase tracking-[0.2em] text-white/50">Waters</h3>
            <ul className="mt-4 space-y-2.5">
              {waters.slice(0, 6).map((w) => (
                <li key={w.slug}>
                  <Link href={routes.destination(w.slug)} className={LINK_CLASSNAME}>
                    {w.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={routes.destinations()} className={LINK_CLASSNAME}>
                  All waters
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-mark text-[11px] uppercase tracking-[0.2em] text-white/50">The familia</h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link href={routes.ourStory()} className={LINK_CLASSNAME}>
                  Our story
                </Link>
              </li>
              <li>
                <Link href={`${routes.ourStory()}#familia`} className={LINK_CLASSNAME}>
                  Meet the familia
                </Link>
              </li>
              <li>
                <Link href={`${routes.ourStory()}#sustainability`} className={LINK_CLASSNAME}>
                  Sustainability
                </Link>
              </li>
              <li>
                <Link href={routes.journal()} className={LINK_CLASSNAME}>
                  Journal
                </Link>
              </li>
              <li>
                <Link href={routes.partners()} className={LINK_CLASSNAME}>
                  Travel agents
                </Link>
              </li>
              <li>
                <Link href={routes.contact()} className={LINK_CLASSNAME}>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-mark text-[11px] uppercase tracking-[0.2em] text-white/50">Private charter</h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link href={routes.charter()} className={LINK_CLASSNAME}>
                  How charter works
                </Link>
              </li>
              <li>
                <Link href={routes.charter({ step: 2 })} className={LINK_CLASSNAME}>
                  Request a charter
                </Link>
              </li>
              <li>
                <Link href={routes.boats()} className={LINK_CLASSNAME}>
                  The fleet
                </Link>
              </li>
              {charterBoats.map((boat) => (
                <li key={boat.slug}>
                  <Link href={routes.boat(boat.slug)} className={LINK_CLASSNAME}>
                    {boat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={routes.faq()} className={LINK_CLASSNAME}>
                  Frequent questions
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-8xl flex-col gap-4 px-5 py-6 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p className="font-mark text-[11px] uppercase tracking-[0.16em] text-white/60">
            © 2026 Sea Familia · PT Keluarga Laut Nusantara · Labuan Bajo &amp; Bira
          </p>
          <nav aria-label="Legal" className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href={routes.policies('privacy')} className={LEGAL_LINK_CLASSNAME}>
              Privacy
            </Link>
            <Link href={routes.policies('terms')} className={LEGAL_LINK_CLASSNAME}>
              Terms
            </Link>
            <Link href={routes.policies('cancellation')} className={LEGAL_LINK_CLASSNAME}>
              Cancellation
            </Link>
            <Link href={routes.policies('safety')} className={LEGAL_LINK_CLASSNAME}>
              Safety
            </Link>
            <Link href={routes.contact()} className={LEGAL_LINK_CLASSNAME}>
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
