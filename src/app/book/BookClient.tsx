"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { departures, trips, boats, waters, findBoat, findTrip, findWater, type Departure, type Trip, type Boat, type Water } from "@/lib/api/data";
import { formatMoney, formatDateRange, formatNights } from "@/lib/utils";

const extrasList = [
  { key: 'gear', label: 'Full dive equipment rental', note: 'BCD, regulator, wetsuit, computer', price: 180, perPerson: true },
  { key: 'guide', label: 'Private dive guide', note: 'Just your group, every dive', price: 520, perPerson: false },
  { key: 'massage', label: 'Massage package, four sessions', note: 'With the crew therapists', price: 240, perPerson: true },
  { key: 'hotel', label: 'Night before, in the gateway port', note: 'Hotel and transfer, twin share', price: 160, perPerson: true },
];

const guestBands = [
  { key: 'adults', label: 'Adults', one: 'Adult', note: '16 and over', min: 1, rate: 1 },
  { key: 'teens', label: 'Teenagers', one: 'Teenager', note: '12 – 15', min: 0, rate: 0.9 },
  { key: 'children', label: 'Children', one: 'Child', note: '4 – 11', min: 0, rate: 0.75 },
];

const months = [
  { value: '2026-08', label: 'August 2026' },
  { value: '2026-09', label: 'September 2026' },
  { value: '2026-10', label: 'October 2026' },
  { value: '2026-11', label: 'November 2026' },
  { value: '2026-12', label: 'December 2026' },
  { value: '2027-01', label: 'January 2027' }
];

const stepsConfig = [
  { key: 'search', label: 'Search' },
  { key: 'summary', label: 'Trip summary' },
  { key: 'cabin', label: 'Cabin' },
  { key: 'guests', label: 'Guests' },
  { key: 'details', label: 'Your details' },
  { key: 'review', label: 'Review' },
  { key: 'done', label: 'Confirmed' },
];

function addDays(dateStr: string, days: number) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

export default function BookClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [step, setStep] = useState(1);
  const [furthest, setFurthest] = useState(1);

  const [search, setSearch] = useState({ water: '', month: '', length: '' });
  const [results, setResults] = useState<Departure[]>([]);

  const [dep, setDep] = useState<Departure | null>(null);
  const trip = dep ? findTrip(dep.trip) : null;
  const boat = dep ? findBoat(dep.boat) : null;
  const water = trip ? findWater(trip.water) : null;
  const endDate = dep ? addDays(dep.start, dep.nights) : "";

  const [cabins, setCabins] = useState<any[]>([]);
  const [cabinCode, setCabinCode] = useState<string>("");

  const [guestsCount, setGuestsCount] = useState({ adults: 2, teens: 0, children: 0 });
  const [chosenExtras, setChosenExtras] = useState<string[]>([]);
  
  const [guestList, setGuestList] = useState<any[]>([]);
  const [lead, setLead] = useState({ email: '', phone: '', notes: '' });

  const [voucher, setVoucher] = useState({ code: '', applied: '', rate: 0, error: '' });
  const [consent, setConsent] = useState({ terms: false, insurance: false, newsletter: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [busy, setBusy] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [reference, setReference] = useState("");
  const [sheet, setSheet] = useState(false);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('sf.reserve');
      if (saved) {
        const s = JSON.parse(saved);
        if (s.guests) setGuestsCount(s.guests);
        if (s.lead) setLead(s.lead);
        if (s.chosenExtras) setChosenExtras(s.chosenExtras);
      }
    } catch (e) {}

    const qDep = searchParams.get('dep');
    const qCabin = searchParams.get('cabin');
    const qGuests = searchParams.get('guests');
    const qRef = searchParams.get('ref');
    
    if (qGuests) {
      setGuestsCount(prev => ({ ...prev, adults: Math.max(1, Math.min(4, Number(qGuests) || 2)) }));
    }
    if (qRef) {
      setReference(qRef);
      setStep(7);
      setFurthest(7);
    } else if (qDep) {
      selectDeparture(qDep, qCabin || "");
    } else {
      runSearch();
    }
  }, [searchParams]);

  useEffect(() => {
    try {
      if (step < 7) {
        sessionStorage.setItem('sf.reserve', JSON.stringify({
          depId: dep ? dep.id : '',
          cabinCode: cabinCode,
          guests: guestsCount,
          lead,
          chosenExtras,
        }));
      }
    } catch (e) {}
  }, [dep, cabinCode, guestsCount, lead, chosenExtras, step]);

  useEffect(() => {
    const wanted: string[] = [];
    for (let i = 0; i < guestsCount.adults; i++) wanted.push("Adult");
    for (let i = 0; i < guestsCount.teens; i++) wanted.push("Teenager");
    for (let i = 0; i < guestsCount.children; i++) wanted.push("Child");

    setGuestList(prev => wanted.map((band, i) => {
      const existing = prev[i];
      return existing ? { ...existing, band } : { name: '', band, nationality: '', diving: 'none', certNumber: '', dives: 0, dietary: '' };
    }));
  }, [guestsCount]);

  const runSearch = () => {
    let filtered = departures.filter(d => d.status === "open" || d.status === "limited");
    if (search.water) filtered = filtered.filter(d => trips.find(t => t.slug === d.trip)?.water === search.water);
    if (search.month) filtered = filtered.filter(d => d.start.startsWith(search.month));
    if (search.length) {
      filtered = filtered.filter(d => {
        if (search.length === "short") return d.nights >= 3 && d.nights <= 5;
        if (search.length === "classic") return d.nights >= 6 && d.nights <= 8;
        if (search.length === "long") return d.nights >= 9;
        return true;
      });
    }
    setResults(filtered.slice(0, 8));
  };

  const clearSearch = () => {
    setSearch({ water: '', month: '', length: '' });
    setResults(departures.filter(d => d.status === "open" || d.status === "limited").slice(0, 8));
  };

  const selectDeparture = (id: string, cabCode: string = "") => {
    const d = departures.find(x => x.id === id);
    if (!d) return;
    setDep(d);
    
    const b = findBoat(d.boat)!;
    const base = Math.min(...b.cabinTypes.map(c => c.price));
    let remaining = d.cabinsLeft;
    
    const genCabins = b.cabinTypes.map((c, i) => {
      const isLast = i === b.cabinTypes.length - 1;
      const take = isLast ? remaining : Math.min(c.left, Math.max(0, remaining - 1));
      remaining -= take;
      return {
        ...c,
        left: Math.max(0, take),
        price: Math.round((d.price + (c.price - base)) / 10) * 10
      };
    });
    setCabins(genCabins);

    if (cabCode) {
      const wanted = genCabins.find(c => c.code === cabCode && c.left > 0);
      if (wanted) setCabinCode(wanted.code);
    }
    
    const targetStep = Math.max(2, Math.min(6, Number(searchParams.get("step")) || 2));
    if (!searchParams.get('ref')) {
       setStep(targetStep);
       setFurthest(Math.max(furthest, targetStep));
    }
  };

  const chooseDeparture = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("dep", id);
    params.set("step", "2");
    router.push(`${pathname}?${params.toString()}`, { scroll: true });
  };

  const cabin = useMemo(() => cabins.find(c => c.code === cabinCode) || null, [cabins, cabinCode]);

  const chooseCabin = (code: string) => {
    const c = cabins.find(x => x.code === code);
    if (!c || c.left <= 0) return;
    setCabinCode(code);
    
    let currentTotal = guestsCount.adults + guestsCount.teens + guestsCount.children;
    let newGuests = { ...guestsCount };
    while (currentTotal > c.maxOccupancy) {
      if (newGuests.children > 0) newGuests.children--;
      else if (newGuests.teens > 0) newGuests.teens--;
      else if (newGuests.adults > 1) newGuests.adults--;
      else break;
      currentTotal = newGuests.adults + newGuests.teens + newGuests.children;
    }
    setGuestsCount(newGuests);
  };

  const totalGuests = guestsCount.adults + guestsCount.teens + guestsCount.children;
  const maxOccupancy = cabin ? cabin.maxOccupancy : 2;
  const occupancyOk = totalGuests >= 1 && totalGuests <= maxOccupancy;
  const leadComplete = guestList[0] && guestList[0].name.trim() && lead.email.trim() && lead.phone.trim();

  const bump = (key: keyof typeof guestsCount, delta: number) => {
    const band = guestBands.find(b => b.key === key)!;
    const next = guestsCount[key] + delta;
    if (next < band.min) return;
    if (delta > 0 && totalGuests >= maxOccupancy) return;
    setGuestsCount(prev => ({ ...prev, [key]: next }));
  };

  const getPriceLines = () => {
    if (!cabin) return [];
    const lines = [];
    for (const b of guestBands) {
      const n = guestsCount[b.key as keyof typeof guestsCount];
      if (!n) continue;
      const unit = Math.round(cabin.price * b.rate);
      lines.push({
        label: `${b.label} × ${n}`,
        detail: `${cabin.name} · ${formatMoney(unit)} each${b.rate < 1 ? ` (${Math.round(b.rate * 100)}%)` : ''}`,
        amount: unit * n
      });
    }
    for (const key of chosenExtras) {
      const x = extrasList.find(e => e.key === key);
      if (!x) continue;
      lines.push({
        label: x.label,
        detail: x.perPerson ? `${formatMoney(x.price)} × ${totalGuests}` : 'One charge for the group',
        amount: x.perPerson ? x.price * totalGuests : x.price
      });
    }
    return lines;
  };

  const priceLines = getPriceLines();
  const cabinSubtotal = cabin ? guestBands.reduce((sum, b) => sum + Math.round(cabin.price * b.rate) * guestsCount[b.key as keyof typeof guestsCount], 0) : 0;
  const subtotal = priceLines.reduce((s, l) => s + l.amount, 0);
  const discount = voucher.rate ? Math.round(cabinSubtotal * voucher.rate) : 0;
  const total = Math.max(0, subtotal - discount);
  const deposit = dep ? Math.round(total * dep.deposit) : 0;

  const applyVoucher = () => {
    const code = voucher.code.trim().toUpperCase();
    setVoucher(prev => ({ ...prev, error: '' }));
    if (!code) { setVoucher(prev => ({ ...prev, error: 'Type the code first.' })); return; }
    const known: Record<string, number> = { FAMILIA10: 0.10, RETURNING: 0.05, AGENT15: 0.15 };
    if (!known[code]) {
      setVoucher(prev => ({ ...prev, error: 'We do not recognise that code. Check it with whoever gave it to you.' }));
      return;
    }
    setVoucher({ code: '', applied: code, rate: known[code], error: '' });
  };

  const removeVoucher = () => setVoucher({ code: '', applied: '', rate: 0, error: '' });

  const firstIncomplete = () => {
    if (!dep) return 1;
    if (!cabin) return 3;
    if (!occupancyOk) return 4;
    if (!leadComplete) return 5;
    return 6;
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (step === 5) {
      const gLead = guestList[0];
      if (!gLead || !gLead.name.trim()) newErrors.name0 = 'We need the lead guest’s name as it appears in the passport.';
      if (!lead.email.trim()) newErrors.email = 'Where should the confirmation go?';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(lead.email.trim())) newErrors.email = 'That address is missing something — check for a typo.';
      if (!lead.phone.trim()) newErrors.phone = 'A number the crew can reach you on if a flight goes wrong.';
    }
    if (step === 6) {
      if (!consent.terms) newErrors.terms = 'Please confirm you have read the booking terms.';
      if (!consent.insurance) newErrors.insurance = 'Insurance covering evacuation is a condition of sailing with us.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goto = (n: number) => {
    const target = Math.max(1, Math.min(7, n));
    if (target > step && target > firstIncomplete()) return;
    setStep(target);
    setFurthest(Math.max(furthest, target));
    setSheet(false);
    if (target < 7) {
      const params = new URLSearchParams(searchParams.toString());
      if (dep) params.set("dep", dep.id);
      if (cabinCode) params.set("cabin", cabinCode);
      params.set("step", target.toString());
      router.push(`${pathname}?${params.toString()}`, { scroll: true });
    }
  };

  const next = () => {
    if (!validate()) return;
    goto(step + 1);
  };

  const back = () => {
    setErrors({});
    goto(step - 1);
  };

  const submit = () => {
    if (!validate()) return;
    setBusy(true);
    setSubmitError(false);

    setTimeout(() => {
      const ref = `SF-${(parseInt(dep!.start.replace(/-/g, '')) + totalGuests * 31 + cabinCode.length).toString(16).toUpperCase()}`;
      setReference(ref);
      setBusy(false);
      setStep(7);
      setSheet(false);
      try { sessionStorage.removeItem('sf.reserve'); } catch (e) {}
      router.push(`${pathname}?ref=${ref}`, { scroll: true });
    }, 1100);
  };

  const canContinue = (() => {
    if (step === 1) return !!dep;
    if (step === 2) return !!dep;
    if (step === 3) return !!cabin;
    if (step === 4) return occupancyOk;
    return true;
  })();

  const getFooterHint = () => {
    if (step === 1) return dep ? 'Date chosen' : `${results.length} dates with cabins free`;
    if (step === 3) return cabin ? cabin.name : 'Choose a cabin grade';
    if (step === 4) return occupancyOk ? 'Fits the cabin' : 'Too many for this cabin';
    if (step === 5) return leadComplete ? 'Lead guest complete' : 'Lead guest details needed';
    if (step === 6) return 'Nothing is charged yet';
    return 'Your voyage';
  };

  return (
    <main id="main" className="pb-32 lg:pb-28">
      {/* FUNNEL HEADER */}
      {step < 7 && (
        <div className="border-b border-sand-300 bg-white">
          <div className="mx-auto max-w-7xl px-5 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-mark text-[11px] uppercase tracking-[0.18em] text-flame">Reserve a cabin</p>
                <p className="mt-1 font-mark text-[11px] uppercase tracking-[0.14em] text-mist-700">
                  Step {step} of 6 · {stepsConfig[step - 1].label}
                </p>
              </div>
              <Link href="/departures" className="group inline-flex items-center gap-2 font-mark text-[11px] uppercase tracking-[0.16em] text-ink/60 hover:text-flame-600">
                <span className="icon icon-cross h-4 w-4" aria-hidden="true"></span>
                <span className="hidden sm:inline">Leave — nothing is saved to your account</span>
                <span className="sm:hidden">Leave</span>
              </Link>
            </div>

            <ol className="mt-4 flex gap-1.5" aria-label="Progress">
              {stepsConfig.slice(0, 6).map((s, i) => (
                <li key={s.key} className="flex-1">
                  <button type="button" onClick={() => goto(i + 1)} disabled={i + 1 > furthest}
                          className="block w-full text-left disabled:cursor-not-allowed">
                    <span className={`block h-1 rounded-full transition ${i + 1 < step ? 'bg-flame' : i + 1 === step ? 'bg-ink' : 'bg-sand-300'}`}></span>
                    <span className={`mt-1.5 hidden font-mark text-[9px] uppercase tracking-[0.12em] lg:block ${i + 1 <= step ? 'text-ink-700' : 'text-mist-400'}`}>
                      {s.label}
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className={`grid gap-8 lg:gap-12 ${step === 7 ? 'lg:grid-cols-1' : 'lg:grid-cols-[1fr_22rem]'}`}>
          
          <div className="min-w-0">
            {/* STEP 1: SEARCH */}
            {step === 1 && (
              <section className="animate-in fade-in duration-200">
                <h1 className="font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl">
                  Which date suits you?
                </h1>
                <p className="mt-3 text-base leading-relaxed text-ink/70">
                  Pick a water and a month, or leave both open and read the list. Everything shown has at least one cabin free.
                </p>
                
                <div className="mt-7 grid gap-3 rounded-2xl bg-white p-5 sm:grid-cols-3 lg:p-6">
                  <label className="block">
                    <span className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Water</span>
                    <select value={search.water} onChange={e => { setSearch({...search, water: e.target.value}); setTimeout(runSearch, 50); }}
                            className="mt-1.5 h-12 w-full rounded-xl border-sand-300 bg-sand text-ink-700 focus:border-mist focus:ring-2 focus:ring-mist/40">
                      <option value="">Anywhere</option>
                      {waters.map(w => <option key={w.slug} value={w.slug}>{w.short}</option>)}
                    </select>
                  </label>
                  <label className="block">
                    <span className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Month</span>
                    <select value={search.month} onChange={e => { setSearch({...search, month: e.target.value}); setTimeout(runSearch, 50); }}
                            className="mt-1.5 h-12 w-full rounded-xl border-sand-300 bg-sand text-ink-700 focus:border-mist focus:ring-2 focus:ring-mist/40">
                      <option value="">Any month</option>
                      {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                    </select>
                  </label>
                  <label className="block">
                    <span className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Length</span>
                    <select value={search.length} onChange={e => { setSearch({...search, length: e.target.value}); setTimeout(runSearch, 50); }}
                            className="mt-1.5 h-12 w-full rounded-xl border-sand-300 bg-sand text-ink-700 focus:border-mist focus:ring-2 focus:ring-mist/40">
                      <option value="">Any</option>
                      <option value="short">3 – 5 nights</option>
                      <option value="classic">6 – 8 nights</option>
                      <option value="long">9+ nights</option>
                    </select>
                  </label>
                </div>

                <div className="mt-6">
                  {results.length === 0 ? (
                    <div className="py-10 text-center">
                      <p className="font-display text-xl text-ink-700">Nothing free on those terms</p>
                      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink/70">
                        Regions run in their own seasons, so a month and a water can cancel each other out. Clear the month first — that usually does it.
                      </p>
                      <button onClick={clearSearch} className="mt-5 inline-flex h-11 items-center rounded-full bg-ink px-5 font-mark text-sm uppercase tracking-[0.12em] text-white transition hover:bg-ink-600">
                        Clear the search
                      </button>
                    </div>
                  ) : (
                    <ul className="space-y-3">
                      {results.map(d => {
                        const tripObj = findTrip(d.trip)!;
                        const boatObj = findBoat(d.boat)!;
                        return (
                          <li key={d.id}>
                            <button onClick={() => chooseDeparture(d.id)}
                                    className={`group flex w-full items-center gap-4 rounded-2xl border-2 bg-white p-4 text-left transition ${dep?.id === d.id ? 'border-flame shadow-card' : 'border-sand-300 hover:border-mist'}`}>
                              <span className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-ink">
                                <span className={`ph absolute inset-0 block ph-${tripObj.ph}`}>
                                  <ImageSlot className="img-slot h-full w-full object-cover" src={`/media/photos/trips/${tripObj.slug}.jpg`} alt="" />
                                </span>
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block font-mark text-[10px] uppercase tracking-[0.16em] text-flame">{formatDateRange(d.start, d.nights)}</span>
                                <span className="mt-1 block font-display text-lg leading-tight text-ink-700">{tripObj.title}</span>
                                <span className="mt-1 block text-xs text-mist-700">
                                  {formatNights(d.nights)} · {boatObj.name} · {d.cabinsLeft} cabins left
                                </span>
                              </span>
                              <span className="shrink-0 text-right">
                                <span className="tnum block font-display text-lg text-deep-700">{formatMoney(d.price)}</span>
                                <span className="block text-[11px] text-ink/50">per person</span>
                              </span>
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </div>
              </section>
            )}

            {/* STEP 2: SUMMARY */}
            {step === 2 && dep && trip && boat && water && (
              <section className="animate-in fade-in duration-200">
                <h1 className="font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl">
                  Is this the week?
                </h1>
                <p className="mt-3 text-base leading-relaxed text-ink/70">
                  Everything below is fixed for this departure. Check the dates against your flights before going on — the day you board is not the day you fly.
                </p>

                <div className="mt-7 overflow-hidden rounded-2xl bg-white">
                  <div className="relative aspect-[16/7]">
                    <div className={`ph absolute inset-0 ph-${trip.ph}`}>
                      <ImageSlot className="img-slot h-full w-full object-cover" src={`/media/photos/trips/${trip.slug}.jpg`} alt={trip.title} />
                    </div>
                    <div className="scrim-soft absolute inset-0"></div>
                    <div className="absolute inset-x-5 bottom-4">
                      <p className="font-mark text-[10px] uppercase tracking-[0.18em] text-white/80">{water.short}</p>
                      <p className="mt-1 font-display text-2xl text-white sm:text-3xl">{trip.title}</p>
                    </div>
                  </div>

                  <dl className="grid grid-cols-2 gap-x-6 gap-y-5 p-5 sm:grid-cols-3 lg:p-6">
                    <div>
                      <dt className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Dates</dt>
                      <dd className="mt-1 font-display text-lg text-ink-700">{formatDateRange(dep.start, dep.nights)}</dd>
                    </div>
                    <div>
                      <dt className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Length</dt>
                      <dd className="mt-1 font-display text-lg text-ink-700">{formatNights(dep.nights)}</dd>
                    </div>
                    <div>
                      <dt className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Boat</dt>
                      <dd className="mt-1 font-display text-lg text-ink-700">{boat.name}</dd>
                    </div>
                    <div>
                      <dt className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Boards &amp; ends</dt>
                      <dd className="mt-1 font-display text-lg text-ink-700">{trip.gateway}</dd>
                    </div>
                    <div>
                      <dt className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Guests on board</dt>
                      <dd className="mt-1 font-display text-lg text-ink-700">Up to {boat.guests}</dd>
                    </div>
                    <div>
                      <dt className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Cabins left</dt>
                      <dd className={`mt-1 font-display text-lg ${dep.cabinsLeft <= 1 ? 'text-flame-600' : 'text-ink-700'}`}>{dep.cabinsLeft}</dd>
                    </div>
                  </dl>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white p-5">
                    <h2 className="font-mark text-[11px] uppercase tracking-[0.16em] text-flame">First and last day</h2>
                    <ul className="mt-3 space-y-3 text-sm leading-relaxed text-ink/80">
                      <li><strong className="text-ink-700">{dep.start}</strong> — aboard by 2pm, transfer from the airport included.</li>
                      <li><strong className="text-ink-700">{endDate}</strong> — alongside by 9am, transfer to the airport included.</li>
                      <li className="text-ink/60">Book flights out after 1pm on the last day.</li>
                    </ul>
                  </div>
                </div>

                <Link href={`/trip/${trip.slug}`} target="_blank" className="mt-5 inline-flex items-center gap-2 font-mark text-[11px] uppercase tracking-[0.16em] text-flame-600 underline underline-offset-4">
                  Read the full day-by-day in a new tab
                </Link>
              </section>
            )}

            {/* STEP 3: CABIN */}
            {step === 3 && boat && (
              <section className="animate-in fade-in duration-200">
                <h1 className="font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl">Choose your cabin</h1>
                <p className="mt-3 text-base leading-relaxed text-ink/70">Prices are per person for this departure, everything on board included.</p>
                <div className="mt-7 space-y-3">
                  {cabins.map(c => (
                    <button key={c.code} onClick={() => chooseCabin(c.code)} disabled={c.left <= 0}
                            className={`flex w-full gap-4 rounded-2xl border-2 bg-white p-4 text-left transition disabled:cursor-not-allowed disabled:opacity-60 ${cabinCode === c.code ? 'border-flame shadow-card' : 'border-sand-300 hover:border-mist'}`}>
                      <span className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-ink sm:h-28 sm:w-36">
                        <span className={`ph absolute inset-0 block ph-${c.ph}`}>
                          <ImageSlot className="img-slot h-full w-full object-cover" src={`/media/photos/cabins/${boat.slug}-${c.code.toLowerCase()}.jpg`} alt={c.name} />
                        </span>
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
                          <span>
                            <span className="block font-display text-lg text-ink-700">{c.name}</span>
                            <span className="mt-0.5 block text-xs text-mist-700">{c.deck} · {c.beds} · sleeps {c.maxOccupancy}</span>
                          </span>
                          <span className="shrink-0 text-right">
                            <span className="tnum block font-display text-lg text-deep-700">{formatMoney(c.price)}</span>
                            <span className="block text-[11px] text-ink/50">per person</span>
                          </span>
                        </span>
                        <span className="mt-2 block font-mark text-[10px] uppercase tracking-[0.14em] text-mist-700">
                          {c.left <= 0 ? 'Fully booked on this date' : c.left === 1 ? 'Last one' : `${c.left} left`}
                        </span>
                      </span>
                      <span className={`mt-1 grid h-7 w-7 shrink-0 place-items-center self-start rounded-full border transition ${cabinCode === c.code ? 'border-flame bg-flame text-white' : 'border-sand-300 text-transparent'}`}>
                        <span className="icon icon-check h-4 w-4" aria-hidden="true"></span>
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* STEP 4: GUESTS */}
            {step === 4 && (
              <section className="animate-in fade-in duration-200">
                <h1 className="font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl">Who is sailing?</h1>
                <p className="mt-3 text-base leading-relaxed text-ink/70">Numbers first, names next.</p>
                <div className="mt-7 rounded-2xl bg-white p-5 lg:p-6">
                  <div className="space-y-4">
                    {guestBands.map(c => (
                      <div key={c.key} className="flex items-center justify-between gap-4 border-b border-sand-200 pb-4 last:border-0 last:pb-0">
                        <div>
                          <p className="text-sm text-ink-700">{c.label}</p>
                          <p className="text-xs text-ink/55">{c.note}</p>
                          {c.rate < 1 && <p className="mt-0.5 font-mark text-[10px] uppercase tracking-[0.14em] text-mist-700">{Math.round(c.rate * 100)}% of the cabin fare</p>}
                        </div>
                        <span className="inline-flex shrink-0 items-center rounded-full border border-sand-300">
                          <button onClick={() => bump(c.key as any, -1)} disabled={guestsCount[c.key as keyof typeof guestsCount] <= c.min}
                                  className="grid h-11 w-11 place-items-center rounded-l-full text-ink-700 transition hover:bg-sand disabled:opacity-30">
                            <span className="icon icon-minus h-4 w-4" aria-hidden="true"></span>
                          </button>
                          <span className="w-12 text-center font-display text-lg text-ink-700">{guestsCount[c.key as keyof typeof guestsCount]}</span>
                          <button onClick={() => bump(c.key as any, 1)} disabled={totalGuests >= maxOccupancy}
                                  className="grid h-11 w-11 place-items-center rounded-r-full text-ink-700 transition hover:bg-sand disabled:opacity-30">
                            <span className="icon icon-plus h-4 w-4" aria-hidden="true"></span>
                          </button>
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className={`mt-5 rounded-xl p-4 ${occupancyOk ? 'bg-sand' : 'bg-flame/5 ring-1 ring-inset ring-flame/25'}`}>
                    <p className={`text-sm leading-relaxed ${occupancyOk ? 'text-ink/75' : 'text-flame-700'}`}>
                      {occupancyOk ? (
                        <span><strong className="text-ink-700">{totalGuests}</strong> in the {cabin?.name || 'cabin'}, which sleeps {maxOccupancy}.</span>
                      ) : (
                        <span><strong className="text-flame-700">{totalGuests}</strong> will not fit — the {cabin?.name || 'cabin'} sleeps {maxOccupancy}.</span>
                      )}
                    </p>
                    {!occupancyOk && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button onClick={() => goto(3)} className="inline-flex h-10 items-center rounded-full bg-flame px-4 font-mark text-[11px] uppercase tracking-[0.12em] text-white">Choose another cabin</button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 rounded-2xl bg-white p-5 lg:p-6">
                  <h2 className="font-mark text-[11px] uppercase tracking-[0.16em] text-ink-700">Anything to add?</h2>
                  <div className="mt-4 space-y-3">
                    {extrasList.map(x => (
                      <label key={x.key} className="flex items-start gap-3 border-b border-sand-200 pb-3 last:border-0 last:pb-0">
                        <input type="checkbox" value={x.key} checked={chosenExtras.includes(x.key)}
                               onChange={(e) => {
                                 if (e.target.checked) setChosenExtras(prev => [...prev, x.key]);
                                 else setChosenExtras(prev => prev.filter(k => k !== x.key));
                               }}
                               className="mt-0.5 h-5 w-5 rounded border-sand-300 text-flame focus:ring-mist/40" />
                        <span className="min-w-0 flex-1">
                          <span className="flex flex-wrap items-baseline justify-between gap-x-4">
                            <span className="text-sm text-ink-700">{x.label}</span>
                            <span className="tnum shrink-0 text-sm text-deep-700">{formatMoney(x.price)}</span>
                          </span>
                          <span className="mt-0.5 block text-xs text-ink/60">{x.note} · {x.perPerson ? 'per person' : 'per group'}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* STEP 5: DETAILS */}
            {step === 5 && (
              <section className="animate-in fade-in duration-200">
                <h1 className="font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl">Guest details</h1>
                <p className="mt-3 text-base leading-relaxed text-ink/70">Only the lead guest is needed now.</p>
                <div className="mt-7 space-y-4">
                  {guestList.map((g, i) => (
                    <fieldset key={i} className="rounded-2xl bg-white p-5 lg:p-6">
                      <legend className="sf-legend flex items-center gap-3 pb-3 font-mark text-[11px] font-medium uppercase tracking-[0.18em] text-ink-700">
                        <span className="h-3.5 w-[3px] shrink-0 rounded-full bg-flame"></span>
                        <span>{i === 0 ? 'Lead guest' : `Guest ${i + 1}`}</span>
                        <span className="shrink-0 rounded-full bg-sand px-2.5 py-1 font-mark text-[10px] uppercase tracking-[0.12em] text-mist-700">{g.band}</span>
                        <span className="h-px flex-1 bg-sand-300"></span>
                      </legend>
                      <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        <label className="block sm:col-span-2">
                          <span className="text-sm text-ink/70">Full name {i === 0 && <span className="text-flame">*</span>}</span>
                          <input type="text" value={g.name} onChange={e => {
                            const newL = [...guestList];
                            newL[i].name = e.target.value;
                            setGuestList(newL);
                          }} className="mt-1.5 h-12 w-full rounded-xl border-sand-300 bg-sand text-ink-700" />
                          {errors[`name${i}`] && <span className="mt-1.5 block text-sm text-flame-600">{errors[`name${i}`]}</span>}
                        </label>
                        {i === 0 && (
                          <>
                            <label className="block">
                              <span className="text-sm text-ink/70">Email <span className="text-flame">*</span></span>
                              <input type="email" value={lead.email} onChange={e => setLead({...lead, email: e.target.value})} className="mt-1.5 h-12 w-full rounded-xl border-sand-300 bg-sand text-ink-700" />
                              {errors.email && <span className="mt-1.5 block text-sm text-flame-600">{errors.email}</span>}
                            </label>
                            <label className="block">
                              <span className="text-sm text-ink/70">Phone <span className="text-flame">*</span></span>
                              <input type="tel" value={lead.phone} onChange={e => setLead({...lead, phone: e.target.value})} className="mt-1.5 h-12 w-full rounded-xl border-sand-300 bg-sand text-ink-700" />
                              {errors.phone && <span className="mt-1.5 block text-sm text-flame-600">{errors.phone}</span>}
                            </label>
                          </>
                        )}
                      </div>
                    </fieldset>
                  ))}
                </div>
              </section>
            )}

            {/* STEP 6: REVIEW */}
            {step === 6 && (
              <section className="animate-in fade-in duration-200">
                <h1 className="font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl">Review and reserve</h1>
                
                <div className="mt-7 rounded-2xl bg-white p-5 lg:p-6">
                  <h2 className="font-mark text-[11px] uppercase tracking-[0.16em] text-ink-700">Before you reserve</h2>
                  <div className="mt-4 space-y-4">
                    <label className="flex items-start gap-3">
                      <input type="checkbox" checked={consent.terms} onChange={e => setConsent({...consent, terms: e.target.checked})} className="mt-0.5 h-5 w-5 rounded border-sand-300 text-flame" />
                      <span className="text-sm leading-relaxed text-ink/80">I have read the booking terms. <span className="text-flame">*</span></span>
                    </label>
                    {errors.terms && <p className="text-sm text-flame-600">{errors.terms}</p>}
                    <label className="flex items-start gap-3">
                      <input type="checkbox" checked={consent.insurance} onChange={e => setConsent({...consent, insurance: e.target.checked})} className="mt-0.5 h-5 w-5 rounded border-sand-300 text-flame" />
                      <span className="text-sm leading-relaxed text-ink/80">Everyone in my party will hold travel insurance. <span className="text-flame">*</span></span>
                    </label>
                    {errors.insurance && <p className="text-sm text-flame-600">{errors.insurance}</p>}
                  </div>
                </div>

                <div className="mt-4 rounded-2xl bg-white p-5 lg:p-6">
                  <h2 className="font-mark text-[11px] uppercase tracking-[0.16em] text-ink-700">Full breakdown</h2>
                  <table className="mt-4 w-full text-sm">
                    <tbody>
                      {priceLines.map(line => (
                        <tr key={line.label} className="border-b border-sand-200">
                          <th className="py-2.5 text-left font-normal text-ink/70">
                            <span>{line.label}</span>
                            <span className="block text-xs text-ink/50">{line.detail}</span>
                          </th>
                          <td className="tnum py-2.5 text-right text-ink-700">{formatMoney(line.amount)}</td>
                        </tr>
                      ))}
                      {discount > 0 && (
                        <tr className="border-b border-sand-200">
                          <th className="py-2.5 text-left font-normal text-flame-600">Voucher {voucher.applied}</th>
                          <td className="tnum py-2.5 text-right text-flame-600">−{formatMoney(discount)}</td>
                        </tr>
                      )}
                      <tr className="border-b-2 border-ink/15">
                        <th className="py-3 text-left font-mark text-[11px] uppercase tracking-[0.14em] text-ink-700">Total, all guests</th>
                        <td className="tnum py-3 text-right font-display text-xl text-ink-700">{formatMoney(total)}</td>
                      </tr>
                      <tr>
                        <th className="py-2.5 text-left font-normal text-ink-700">Deposit to reserve</th>
                        <td className="tnum py-2.5 text-right font-display text-lg text-deep-700">{formatMoney(deposit)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* STEP 7: DONE */}
            {step === 7 && dep && trip && (
              <section className="animate-in fade-in duration-200 lg:col-span-2">
                <div className="mx-auto max-w-2xl">
                  <div className="rounded-4xl bg-white p-7 shadow-card lg:p-12">
                    <span className="grid h-16 w-16 place-items-center rounded-full bg-mist-100 text-ink-700">
                      <span className="icon icon-big-check h-8 w-8" aria-hidden="true"></span>
                    </span>
                    <p className="mt-6 font-mark text-eyebrow uppercase text-flame">Cabin reserved</p>
                    <h1 className="mt-4 font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl">
                      Held for you — welcome to the familia
                    </h1>
                    <p className="mt-4 text-base leading-relaxed text-ink/70">
                      Your cabin is held for 72 hours. Nothing has been charged.
                    </p>
                    <dl className="mt-8 grid gap-5 rounded-2xl bg-sand p-5 sm:grid-cols-2 lg:p-6">
                      <div>
                        <dt className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Booking reference</dt>
                        <dd className="mt-1 font-display text-2xl tracking-wide text-ink-700">{reference}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* ASIDE SUMMARY */}
          {step > 1 && step < 7 && dep && trip && boat && water && (
            <aside className="hidden lg:block">
              <div className="lg:sticky lg:top-28">
                <div className="overflow-hidden rounded-3xl bg-white shadow-card">
                  <div className="relative h-28">
                    <div className={`ph ph-${trip.ph} absolute inset-0`}>
                      <ImageSlot className="img-slot h-full w-full object-cover" src={`/media/photos/trips/${trip.slug}.jpg`} alt="" />
                    </div>
                    <div className="scrim-soft absolute inset-0"></div>
                    <div className="absolute inset-x-5 bottom-3">
                      <p className="font-mark text-[10px] uppercase tracking-[0.16em] text-white/80">{water.short}</p>
                      <p className="font-display text-lg leading-tight text-white">{trip.title}</p>
                    </div>
                  </div>
                  <div className="p-5">
                    <dl className="mt-3 space-y-2 text-sm">
                      <div className="flex justify-between border-b border-sand-200 pb-2"><dt className="text-ink/55">Dates</dt><dd className="text-ink-700">{formatDateRange(dep.start, dep.nights)}</dd></div>
                      <div className="flex justify-between border-b border-sand-200 pb-2"><dt className="text-ink/55">Length</dt><dd className="text-ink-700">{formatNights(dep.nights)}</dd></div>
                      <div className="flex justify-between border-b border-sand-200 pb-2"><dt className="text-ink/55">Boat</dt><dd className="text-ink-700">{boat.name}</dd></div>
                      <div className="flex justify-between border-b border-sand-200 pb-2">
                        <dt className="text-ink/55">Cabin</dt>
                        <dd className="text-right text-ink-700">
                          {cabin ? <>{cabin.name} <span className="block text-xs text-ink/50">{cabin.beds}</span></> : <span className="text-ink/45">Not chosen</span>}
                        </dd>
                      </div>
                    </dl>
                    {cabin && (
                      <div className="mt-4 border-t border-sand-300 pt-4">
                        <div className="mt-3 flex items-baseline justify-between gap-3 border-t border-ink/15 pt-3">
                          <span className="font-mark text-[10px] uppercase tracking-[0.14em] text-ink-700">Total</span>
                          <span className="font-display text-xl text-ink-700">{formatMoney(total)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </aside>
          )}

        </div>
      </div>

      {/* FOOTER */}
      {step < 7 && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-sand-300 bg-white/95 shadow-rail backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center gap-3 px-5 py-3 sm:px-6 lg:px-8">
            <button type="button" onClick={back} disabled={step === 1}
                    className="inline-flex h-12 items-center gap-2 rounded-full border border-sand-300 px-4 font-mark text-[12px] uppercase tracking-[0.14em] text-ink-700 transition hover:border-ink disabled:opacity-40 sm:px-5">
              <span className="icon icon-chevron-left h-4 w-4" aria-hidden="true"></span>
              <span className="hidden sm:inline">Back</span>
            </button>

            <button type="button" onClick={() => setSheet(true)} className={`min-w-0 flex-1 text-left ${step === 1 ? 'lg:pointer-events-none' : ''}`}>
              <span className="flex items-center gap-1.5">
                <span className="truncate font-mark text-[10px] uppercase tracking-[0.14em] text-mist-700">{getFooterHint()}</span>
              </span>
              {step > 1 && (
                <span className="block text-sm text-ink-700">
                  {cabin ? (
                    <><span className="tnum font-display text-base">{formatMoney(total)}</span> <span className="text-xs text-ink/55">total</span></>
                  ) : <span className="text-xs text-ink/55">No cabin chosen yet</span>}
                </span>
              )}
            </button>

            {step < 6 && (
              <button type="button" onClick={next} disabled={!canContinue}
                      className="inline-flex h-12 shrink-0 items-center gap-2 rounded-full bg-flame px-5 font-mark text-[12px] uppercase tracking-[0.14em] text-white transition hover:bg-flame-600 disabled:opacity-40 sm:px-6">
                <span>{step === 5 ? 'Review' : 'Continue'}</span>
                <span className="icon icon-chevron-right h-4 w-4" aria-hidden="true"></span>
              </button>
            )}

            {step === 6 && (
              <button type="button" onClick={submit} disabled={busy}
                      className="inline-flex h-12 shrink-0 items-center gap-2 rounded-full bg-flame px-5 font-mark text-[12px] uppercase tracking-[0.14em] text-white transition hover:bg-flame-600 disabled:opacity-60 sm:px-6">
                {!busy ? <span>Reserve my cabin</span> : <span>Reserving…</span>}
              </button>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
