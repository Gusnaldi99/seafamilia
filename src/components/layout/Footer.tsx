import Link from "next/link";
import Image from "next/image";
import { NewsletterForm } from "./NewsletterForm";

export function Footer() {
  return (
    <footer className="bg-ink text-white">
      {/* ---------- Brand + newsletter ---------- */}
      <div className="border-b border-white/10">
        <div className="mx-auto grid max-w-[88rem] gap-10 px-5 py-14 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:px-8 lg:py-20">
          <div>
            <Image
              src="/logo/logo-light.png"
              alt="Sea Familia"
              width={120}
              height={118}
              className="h-24 w-auto opacity-95"
            />
            <p className="mt-6 max-w-md font-display text-2xl leading-snug text-white/90 sm:text-3xl">
              Four boats, one family, and the eastern half of Indonesia.
            </p>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/60">
              We started with one phinisi built in Bira and a loan nobody sensible would have
              given us. The boats have multiplied. The crew list has barely changed.
            </p>
          </div>

          <div>
            <h2 className="font-mark text-[11px] uppercase tracking-[0.2em] text-white/50">
              The familia letter
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/75">
              Once a month: where the boats are, what the reef is doing, and the occasional
              cabin that has opened up. No countdown timers.
            </p>
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* ---------- Link columns ---------- */}
      <div className="mx-auto max-w-[88rem] px-5 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div>
            <h3 className="font-mark text-[11px] uppercase tracking-[0.2em] text-white/50">
              Passages
            </h3>
            <ul className="mt-4 space-y-2.5">
              <li><Link href="/destinations?length=short" className="text-sm text-white/80 transition hover:text-white">3 – 5 nights</Link></li>
              <li><Link href="/destinations?length=classic" className="text-sm text-white/80 transition hover:text-white">6 – 8 nights</Link></li>
              <li><Link href="/destinations?length=long" className="text-sm text-white/80 transition hover:text-white">9 – 14 nights</Link></li>
              <li><Link href="/destinations" className="text-sm text-white/80 transition hover:text-white">All itineraries</Link></li>
              <li><Link href="/departures" className="text-sm text-white/80 transition hover:text-white">Departure calendar</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-mark text-[11px] uppercase tracking-[0.2em] text-white/50">
              Waters
            </h3>
            <ul className="mt-4 space-y-2.5">
              <li><Link href="/destinations/komodo" className="text-sm text-white/80 transition hover:text-white">Komodo</Link></li>
              <li><Link href="/destinations/raja-ampat" className="text-sm text-white/80 transition hover:text-white">Raja Ampat</Link></li>
              <li><Link href="/destinations/banda" className="text-sm text-white/80 transition hover:text-white">Banda Sea</Link></li>
              <li><Link href="/destinations/alor" className="text-sm text-white/80 transition hover:text-white">Alor & Solor</Link></li>
              <li><Link href="/destinations/triton" className="text-sm text-white/80 transition hover:text-white">Triton Bay</Link></li>
              <li><Link href="/destinations" className="text-sm text-white/80 transition hover:text-white">All waters</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-mark text-[11px] uppercase tracking-[0.2em] text-white/50">
              The familia
            </h3>
            <ul className="mt-4 space-y-2.5">
              <li><Link href="/our-story" className="text-sm text-white/80 transition hover:text-white">Our story</Link></li>
              <li><Link href="/journal" className="text-sm text-white/80 transition hover:text-white">Journal</Link></li>
              <li><Link href="/contact" className="text-sm text-white/80 transition hover:text-white">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-mark text-[11px] uppercase tracking-[0.2em] text-white/50">
              Private charter
            </h3>
            <ul className="mt-4 space-y-2.5">
              <li><Link href="/charter" className="text-sm text-white/80 transition hover:text-white">How charter works</Link></li>
              <li><Link href="/charter/dates" className="text-sm text-white/80 transition hover:text-white">Request a charter</Link></li>
              <li><Link href="/boats" className="text-sm text-white/80 transition hover:text-white">The fleet</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* ---------- Legal bar ---------- */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[88rem] flex-col gap-4 px-5 py-6 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p className="font-mark text-[11px] uppercase tracking-[0.16em] text-white/45">
            © {new Date().getFullYear()} Sea Familia · PT Keluarga Laut Nusantara · Labuan Bajo &amp; Bira
          </p>
          <nav aria-label="Legal" className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/policies#privacy" className="font-mark text-[11px] uppercase tracking-[0.16em] text-white/60 transition hover:text-white">Privacy</Link>
            <Link href="/policies#terms" className="font-mark text-[11px] uppercase tracking-[0.16em] text-white/60 transition hover:text-white">Terms</Link>
            <Link href="/policies#cancellation" className="font-mark text-[11px] uppercase tracking-[0.16em] text-white/60 transition hover:text-white">Cancellation</Link>
            <Link href="/contact" className="font-mark text-[11px] uppercase tracking-[0.16em] text-white/60 transition hover:text-white">Contact</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
