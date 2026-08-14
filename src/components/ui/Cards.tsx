import { ImageSlot } from "@/components/ui/ImageSlot";
import Link from "next/link";
import { format } from "date-fns";
import type { Trip, Boat, Departure, CabinType } from "@/lib/api/data";
import { findWater, findBoat, findTrip, type Article, type Experience, type Water } from "@/lib/api/data";

const formatPrice = (price: number) => {
  return `$${price.toLocaleString("en-US")}`;
};

export function TripCard({ trip, hideBoat = false }: { trip: Trip; hideBoat?: boolean }) {
  const water = findWater(trip.water);
  const boat = findBoat(trip.boat);

  return (
    <Link href={`/trip/${trip.slug}`} className="group block focus:outline-none focus:ring-2 focus:ring-mist focus:ring-offset-2">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-ink">
        <div className={`ph ph-${trip.ph} absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.04]`}>
          <ImageSlot className="img-slot h-full w-full object-cover" src={`/media/photos/trips/${trip.slug}.jpg`} alt={trip.title} loading="lazy" />
        </div>
        <div className="scrim-soft absolute inset-0"></div>
        {trip.editorPick && (
          <div className="absolute left-3 top-3">
            <span className="inline-flex items-center rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-mark uppercase tracking-[0.14em] text-white ring-1 ring-inset ring-white/25 backdrop-blur">
              Editor's pick
            </span>
          </div>
        )}
        <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2">
          <span className="inline-flex items-center rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-mark uppercase tracking-[0.14em] text-ink-700">
            {water ? water.short : "—"}
          </span>
          <span className="font-mark text-[11px] uppercase tracking-[0.14em] text-white/90">
            {trip.nights} nights
          </span>
        </div>
      </div>
      <div className="pt-4">
        <h3 className="font-display text-xl leading-snug text-ink-700 transition-colors group-hover:text-flame-600">
          {trip.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink/70">
          {trip.summary}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-mist-700">
          {boat && <span>{boat.name}</span>}
          {boat && !hideBoat && (
            <>
              <span className="text-mist-300" aria-hidden="true">·</span>
              <span>{boat.type}</span>
            </>
          )}
        </div>
        <div className="mt-3 flex items-baseline gap-1.5 border-t border-sand-300 pt-3">
          <span className="font-mark text-[11px] uppercase tracking-[0.16em] text-mist-700">From</span>
          <span className="font-display text-lg text-deep-700">{formatPrice(trip.from)}</span>
          <span className="text-xs text-ink/50">pp</span>
        </div>
      </div>
    </Link>
  );
}

export function BoatCard({ boat }: { boat: Boat }) {
  return (
    <Link href={`/boats/${boat.slug}`} className="group block focus:outline-none focus:ring-2 focus:ring-mist focus:ring-offset-2">
      <div className="relative aspect-[3/2] overflow-hidden rounded-2xl bg-ink">
        <div className={`ph ph-${boat.ph} absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.04]`}>
          <ImageSlot className="img-slot h-full w-full object-cover" src={`/media/photos/boats/${boat.slug}.jpg`} alt={boat.name} loading="lazy" />
        </div>
        <div className="scrim-soft absolute inset-0"></div>
        <div className="absolute inset-x-4 bottom-4">
          <div className="font-mark text-[11px] uppercase tracking-[0.18em] text-white/80">{boat.type}</div>
          <div className="mt-1 font-display text-2xl text-white">{boat.name}</div>
        </div>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-ink/75">{boat.tagline}</p>
      <dl className="mt-4 grid grid-cols-4 gap-2 border-t border-sand-300 pt-3 text-center">
        <div>
          <dt className="font-mark text-[10px] uppercase tracking-[0.14em] text-mist-700">Length</dt>
          <dd className="mt-0.5 font-display text-base text-ink-700">{boat.length}</dd>
        </div>
        <div>
          <dt className="font-mark text-[10px] uppercase tracking-[0.14em] text-mist-700">Guests</dt>
          <dd className="mt-0.5 font-display text-base text-ink-700">{boat.guests}</dd>
        </div>
        <div>
          <dt className="font-mark text-[10px] uppercase tracking-[0.14em] text-mist-700">Cabins</dt>
          <dd className="mt-0.5 font-display text-base text-ink-700">{boat.cabins}</dd>
        </div>
        <div>
          <dt className="font-mark text-[10px] uppercase tracking-[0.14em] text-mist-700">Crew</dt>
          <dd className="mt-0.5 font-display text-base text-ink-700">{boat.crew}</dd>
        </div>
      </dl>
    </Link>
  );
}

export function CabinCard({ cabin, boatSlug }: { cabin: CabinType; boatSlug: string }) {
  const sold = cabin.left <= 0;
  
  return (
    <div className={`relative flex gap-4 rounded-2xl border p-4 transition ${sold ? 'border-sand-300 bg-sand/60 opacity-70' : 'border-sand-300 bg-white hover:border-mist-400'}`}>
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl sm:h-28 sm:w-32">
        <div className={`ph ph-${cabin.ph} absolute inset-0`}>
          <ImageSlot className="img-slot h-full w-full object-cover" src={`/media/photos/cabins/${boatSlug}-${cabin.code}.jpg`} alt={cabin.name} loading="lazy" />
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h4 className="font-display text-lg text-ink-700">{cabin.name}</h4>
            <p className="mt-0.5 text-xs text-mist-700">
              {cabin.deck} · {cabin.beds} · sleeps {cabin.maxOccupancy}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <span className="font-display text-lg text-deep-700">{formatPrice(cabin.price)}</span>
            <div className="text-[11px] text-ink/50">pp</div>
          </div>
        </div>
        <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-ink/65">
          {cabin.features?.map((f: string) => <li key={f}>{f}</li>)}
        </ul>
        <p className={`mt-2 font-mark text-[11px] uppercase tracking-[0.14em] ${sold ? 'text-ink/40' : cabin.left <= 1 ? 'text-flame-600' : 'text-mist-700'}`}>
          {sold ? 'Fully booked' : cabin.left === 1 ? 'Last cabin' : `${cabin.left} cabins left`}
        </p>
      </div>
    </div>
  );
}

export function ExperienceCard({ experience }: { experience: Experience }) {
  return (
    <Link href={`/experience/${experience.slug}`} className="group relative block overflow-hidden rounded-2xl bg-ink focus:outline-none focus:ring-2 focus:ring-mist focus:ring-offset-2">
      <div className={`ph ph-${experience.ph} absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.05]`}>
        <ImageSlot className="img-slot h-full w-full object-cover" src={`/media/photos/experiences/${experience.slug}.jpg`} alt={experience.name} loading="lazy" />
      </div>
      <div className="scrim absolute inset-0"></div>
      <div className="relative flex aspect-[4/5] flex-col justify-end p-5 sm:aspect-[3/4] sm:p-6">
        <span className={`icon icon-exp-${experience.slug} mb-4 h-9 w-9 text-white/85`} aria-hidden="true"></span>
        <h3 className="font-display text-2xl leading-tight text-white">{experience.name}</h3>
        <p className="mt-1.5 font-mark text-[11px] uppercase tracking-[0.16em] text-white/70">{experience.tagline}</p>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/85">{experience.blurb}</p>
        <span className="mt-4 inline-flex items-center gap-2 font-mark text-[11px] uppercase tracking-[0.18em] text-white">
          Explore
          <span className="icon icon-chevron-right h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true"></span>
        </span>
      </div>
    </Link>
  );
}

export function WaterCard({ water, tripsCount }: { water: Water; tripsCount: number }) {
  return (
    <Link href={`/destinations/${water.slug}`} className="group block focus:outline-none focus:ring-2 focus:ring-mist focus:ring-offset-2">
      <div className="relative aspect-[3/4] overflow-hidden bg-ink arch-soft">
        <div className={`ph ph-${water.ph} absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.05]`}>
          <ImageSlot className="img-slot h-full w-full object-cover" src={`/media/photos/waters/${water.slug}.jpg`} alt={water.name} loading="lazy" />
        </div>
        <div className="scrim absolute inset-0"></div>
        <div className="absolute inset-x-4 bottom-4 text-center">
          <div className="font-mark text-[10px] uppercase tracking-[0.2em] text-white/75">{water.season}</div>
          <h3 className="mt-1.5 font-display text-2xl leading-tight text-white">{water.short}</h3>
          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-white/80">{water.blurb}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-center gap-2 text-xs text-mist-700">
        <span className="whitespace-nowrap">{tripsCount} itineraries</span>
        <span className="text-mist-300" aria-hidden="true">·</span>
        <span className="whitespace-nowrap">From {water.gateway}</span>
      </div>
    </Link>
  );
}

export function ArticleCard({ article, tall = false }: { article: Article; tall?: boolean }) {
  return (
    <Link href={`/journal/${article.slug}`} className="group block focus:outline-none focus:ring-2 focus:ring-mist focus:ring-offset-2">
      <div className={`relative overflow-hidden rounded-2xl bg-ink ${tall ? 'aspect-[4/5]' : 'aspect-[16/10]'}`}>
        <div className={`ph ph-${article.ph} absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.04]`}>
          <ImageSlot className="img-slot h-full w-full object-cover" src={`/media/photos/journal/${article.slug}.jpg`} alt={article.title} loading="lazy" />
        </div>
        <div className="absolute left-3 top-3">
          <span className="inline-flex items-center rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-mark uppercase tracking-[0.14em] text-ink-700">
            {article.category}
          </span>
        </div>
      </div>
      <div className="pt-4">
        <h3 className="font-display text-xl leading-snug text-ink-700 transition-colors group-hover:text-flame-600">
          {article.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink/70">
          {article.dek}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-mist-700">
          <span>{article.author}</span>
          <span className="text-mist-300" aria-hidden="true">·</span>
          <span>{format(new Date(article.date), 'MMM d, yyyy')}</span>
          <span className="text-mist-300" aria-hidden="true">·</span>
          <span>{article.read} min read</span>
        </div>
      </div>
    </Link>
  );
}

export function DepartureCard({ departure, hideCta = false }: { departure: Departure; hideCta?: boolean }) {
  const trip = findTrip(departure.trip);
  const boat = findBoat(departure.boat);
  const water = trip ? findWater(trip.water) : null;
  
  const closed = departure.status === 'closed';
  const waitlisted = departure.status === 'waitlist';
  const urgent = departure.status !== 'open';

  const gatewayParts = trip?.gateway?.split(' to ') || [];
  const boards = gatewayParts[0] || null;
  const disembarks = gatewayParts[1] || boards;

  const availability = closed ? 'Fully booked'
    : waitlisted ? 'Waitlist open'
    : `${departure.cabinsLeft} ${departure.cabinsLeft === 1 ? 'cabin' : 'cabins'} left`;

  const endDate = new Date(departure.start);
  endDate.setDate(endDate.getDate() + departure.nights);
  const dateStr = `${format(new Date(departure.start), 'd')} – ${format(endDate, 'd MMM yyyy')}`;

  const Cta = () => {
    if (closed) return <span className="inline-flex h-11 items-center rounded-full bg-sand-200 px-5 font-mark text-sm uppercase tracking-[0.12em] text-ink/40">Sold out</span>;
    if (waitlisted) return <Link href={`/contact?ref=${departure.id}&topic=waitlist`} className="inline-flex h-11 items-center rounded-full border border-ink/20 px-5 font-mark text-sm uppercase tracking-[0.12em] text-ink-700 transition hover:border-ink hover:bg-ink hover:text-white">Join waitlist</Link>;
    return <Link href={`/departures/${departure.id}`} className="inline-flex h-11 items-center rounded-full bg-flame px-5 font-mark text-sm uppercase tracking-[0.12em] text-white transition hover:bg-flame-600">Select</Link>;
  };

  return (
    <article className={`group relative flex flex-col gap-4 rounded-2xl border border-sand-300 bg-white p-4 transition hover:border-mist-300 hover:shadow-card sm:flex-row sm:items-center sm:gap-5 sm:p-5 ${closed ? 'opacity-70' : ''}`}>
      <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-xl sm:h-24 sm:w-32">
        <div className={`ph ph-${trip ? trip.ph : 'reef'} absolute inset-0`}>
          {trip && <ImageSlot className="img-slot h-full w-full object-cover" src={`/media/photos/trips/${trip.slug}.jpg`} alt={trip.title} loading="lazy" />}
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-flame px-2.5 py-1 text-[11px] font-mark font-medium uppercase tracking-[0.12em] text-white">
            Shared trip
          </span>
          <span className="font-mark text-[11px] uppercase tracking-[0.14em] text-mist-700">{departure.id}</span>
        </div>
        <h3 className="mt-2 font-display text-lg text-ink-700">
          {closed ? (trip?.title || '—') : <Link href={`/trip/${trip?.slug}`} className="hover:text-flame-600">{trip?.title || '—'}</Link>}
        </h3>
        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-ink/70">
          <span className="icon icon-boat-mast h-3.5 w-3.5 shrink-0 text-mist-700" aria-hidden="true"></span>
          {boat?.name || '—'}
        </p>
        {boards && (
          <p className="mt-1 flex items-center gap-1.5 text-sm text-ink/70">
            <span className="icon icon-map-pin h-3.5 w-3.5 shrink-0 text-mist-700" aria-hidden="true"></span>
            {disembarks && disembarks !== boards ? `Boards ${boards} · Disembarks ${disembarks}` : `Round trip from ${boards}`}
          </p>
        )}
        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink/70">
          <span className="whitespace-nowrap">{dateStr}</span>
          <span className="text-mist-300" aria-hidden="true">·</span>
          <span className="whitespace-nowrap">{departure.nights} nights</span>
          {water && (
            <>
              <span className="text-mist-300" aria-hidden="true">·</span>
              <span className="whitespace-nowrap">{water.short}</span>
            </>
          )}
        </div>
        <p className={`mt-1.5 text-sm font-medium ${urgent ? 'text-flame-600' : 'text-ink/60'}`}>
          {availability}
        </p>
        {trip && !hideCta && (
          <Link href={`/trip/${trip.slug}`} className="mt-2 inline-flex items-center gap-1 font-mark text-[11px] uppercase tracking-[0.14em] text-flame-600 underline underline-offset-4">
            See itinerary details
            <span className="icon icon-chevron-right h-3 w-3" aria-hidden="true"></span>
          </Link>
        )}
      </div>
      <div className="flex items-center justify-between gap-4 border-t border-sand-200 pt-4 sm:flex-col sm:items-end sm:border-0 sm:pt-0 sm:text-right">
        <div>
          <div className="font-mark text-[11px] uppercase tracking-[0.16em] text-mist-700">From</div>
          <div className="font-display text-xl text-deep-700">{formatPrice(departure.price)}</div>
          <div className="text-xs text-ink/50">pp</div>
        </div>
        {!hideCta && <Cta />}
      </div>
    </article>
  );
}
