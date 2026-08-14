"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type RouteDay = {
  day: string;
  title: string;
  text: string;
};

export function TripRouteAccordion({ nights, route }: { nights: number; route: RouteDay[] }) {
  // Using an array of booleans to track open states for each day
  const [openStates, setOpenStates] = useState<boolean[]>(new Array(route.length).fill(false));

  const toggleDay = (index: number) => {
    setOpenStates((prev) => {
      const newState = [...prev];
      newState[index] = !newState[index];
      return newState;
    });
  };

  const openAll = () => setOpenStates(new Array(route.length).fill(true));
  const closeAll = () => setOpenStates(new Array(route.length).fill(false));

  // If there are only a few route days (or it's provisional), we might show a notice.
  // In the original, there's a provisional flag, we'll just mock it as false for now.
  const routeIsProvisional = false;

  return (
    <section id="route" className="mx-auto max-w-[88rem] px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="font-mark text-[11px] uppercase tracking-[0.2em] text-flame">Day by day</p>
          <h2 className="mt-4 font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl">
            How the {nights} nights run
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-ink/70">
            A plan rather than a promise. The captain reads the weather each morning and reorders
            freely — which is exactly why guests who have sailed with us twice stop reading this
            section.
          </p>
          <div className="mt-6 flex gap-2">
            <button
              type="button"
              onClick={openAll}
              className="rounded-full border border-sand-300 px-4 py-2 font-mark text-[11px] uppercase tracking-[0.12em] text-ink-700 transition hover:border-mist"
            >
              Expand all
            </button>
            <button
              type="button"
              onClick={closeAll}
              className="rounded-full border border-sand-300 px-4 py-2 font-mark text-[11px] uppercase tracking-[0.12em] text-ink-700 transition hover:border-mist"
            >
              Collapse
            </button>
          </div>
          {routeIsProvisional && (
            <p className="mt-6 rounded-2xl bg-sand p-4 text-xs leading-relaxed text-ink/65 animate-fade-in">
              <strong className="text-ink-700">Outline only.</strong> The detailed day-by-day for this
              route is still being written up by the crew who sailed it. The anchorages listed are
              the ones we use; the order will shift.
            </p>
          )}
        </div>

        <ol className="divide-y divide-sand-300 border-y border-sand-300">
          {route.map((d, i) => (
            <li key={i}>
              <h3>
                <button
                  type="button"
                  onClick={() => toggleDay(i)}
                  aria-expanded={openStates[i]}
                  className="group flex w-full items-start gap-5 py-5 text-left"
                >
                  <span className="mt-0.5 shrink-0 font-mark text-[11px] uppercase tracking-[0.16em] text-mist">
                    Day {d.day}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-lg text-ink-700 transition-colors group-hover:text-flame-600 sm:text-xl">
                      {d.title}
                    </span>
                  </span>
                  <span className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-sand-300 text-ink-700 transition group-hover:border-mist">
                    <span
                      className={cn("icon icon-plus h-3.5 w-3.5 transition-transform", openStates[i] && "rotate-45")}
                      aria-hidden="true"
                    />
                  </span>
                </button>
              </h3>
              {openStates[i] && (
                <div className="animate-fade-in">
                  <p className="pb-6 pl-0 pr-10 text-sm leading-relaxed text-ink/75 sm:pl-[5.5rem]">
                    {d.text}
                  </p>
                </div>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
