"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type Panel = "search" | "menu" | "signin" | null;

const NAV_ITEMS = [
  { href: "/experiences", label: "Experiences", key: "experiences" },
  { href: "/destinations", label: "Destinations", key: "destinations" },
  { href: "/boats", label: "Boats", key: "boats" },
  { href: "/departures", label: "Departures", key: "departures" },
  { href: "/our-story", label: "Our Story", key: "story" },
  { href: "/journal", label: "Journal", key: "journal" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState<Panel>(null);
  const [compact, setCompact] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const toggle = useCallback(
    (panel: Panel) => setOpen((prev) => (prev === panel ? null : panel)),
    []
  );
  const closeAll = useCallback(() => setOpen(null), []);

  // Compact header on scroll
  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 36);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close panels on Escape
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAll();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeAll]);

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(null);
  }

  return (
    <>
      {/* ---------- utility bar ---------- */}
      <div className="hidden bg-ink text-white/80 lg:block">
        <div className="mx-auto flex h-9 max-w-[88rem] items-center justify-between px-6 lg:px-8">
          <p className="font-mark text-[11px] uppercase tracking-[0.18em]">
            Open trips &amp; private charter · Komodo to Raja Ampat
          </p>
          <div className="flex items-center gap-1">
            <span className="h-3 w-px bg-white/20" />
            <a
              href="https://wa.me/6281100000000"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2 font-mark text-[11px] uppercase tracking-[0.16em] hover:text-white"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* ---------- main header ---------- */}
      <header
        className={cn(
          "sticky top-0 z-40 border-b border-ink/10 backdrop-blur-md transition-all duration-300",
          compact
            ? "bg-white/[0.97] shadow-[0_1px_2px_rgba(0,48,73,.05),0_10px_28px_-14px_rgba(0,48,73,.22)]"
            : "bg-white/[0.92]"
        )}
      >
        <div className="mx-auto max-w-[88rem] px-5 sm:px-6 lg:px-8">
          <div
            className={cn(
              "flex items-center justify-between gap-3 transition-[height] duration-300 ease-[cubic-bezier(.22,1,.36,1)]",
              compact ? "h-[3.25rem] lg:h-16" : "h-16 lg:h-20"
            )}
          >
            {/* Logo */}
            <Link href="/" className="flex shrink-0 items-center gap-3 text-ink-700">
              <span 
                className={cn(
                  "sf-mark icon icon-mark w-auto transition-[height] duration-300 ease-[cubic-bezier(.22,1,.36,1)]",
                  compact ? "h-7 lg:h-9" : "h-9 lg:h-11"
                )} 
                aria-hidden="true" 
              />
              <span className="flex flex-col leading-none">
                <span className="font-mark text-[15px] font-medium uppercase tracking-[0.3em] lg:text-[17px]">
                  Sea
                </span>
                <span className="font-mark text-[15px] font-medium uppercase tracking-[0.3em] text-flame lg:text-[17px]">
                  Familia
                </span>
              </span>
              <span className="sr-only">Sea Familia — home</span>
            </Link>

            {/* Primary nav (desktop) */}
            <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    className={cn(
                      "relative rounded-full px-3 py-2 font-mark text-[13px] uppercase tracking-[0.14em] transition",
                      isActive
                        ? "text-flame"
                        : "text-ink-700 hover:text-flame-600"
                    )}
                    {...(isActive ? { "aria-current": "page" as const } : {})}
                  >
                    {item.label}
                    {isActive && (
                      <span className="absolute inset-x-3 -bottom-px h-px bg-flame" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-1">
              {/* Search */}
              <button
                type="button"
                onClick={() => toggle("search")}
                aria-expanded={open === "search"}
                aria-label="Search"
                className="grid h-10 w-10 place-items-center rounded-full text-ink-700 transition hover:bg-sand"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" strokeLinecap="round" />
                </svg>
              </button>

              {/* Sign in (desktop) */}
              <button
                type="button"
                onClick={() => toggle("signin")}
                className="hidden h-10 items-center gap-2 rounded-full px-3 font-mark text-[12px] uppercase tracking-[0.14em] text-ink-700 transition hover:bg-sand lg:flex"
              >
                Sign in
              </button>

              {/* Plan your trip CTA (desktop) */}
              <Link
                href="/experiences"
                className="hidden h-10 items-center gap-2 rounded-full bg-flame px-4 font-mark text-[12px] uppercase tracking-[0.14em] text-white transition hover:bg-flame-600 lg:flex"
              >
                Plan your trip
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>

              {/* Mobile menu button */}
              <button
                type="button"
                onClick={() => toggle("menu")}
                aria-expanded={open === "menu"}
                aria-label="Menu"
                className="grid h-10 w-10 place-items-center rounded-full text-ink-700 transition hover:bg-sand lg:hidden"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* ---------- Search panel ---------- */}
        {open === "search" && (
          <div className="absolute inset-x-0 top-full border-b border-ink/10 bg-white shadow-lift animate-fade-in">
            <div className="mx-auto max-w-3xl px-5 py-6 sm:px-6">
              <div className="relative">
                <svg className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-mist-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" strokeLinecap="round" />
                </svg>
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Reefs, boats, an island, a month…"
                  aria-label="Search"
                  className="h-14 w-full rounded-full border-sand-300 bg-sand pl-12 pr-4 font-sans text-base text-ink-700 placeholder:text-ink/40 focus:border-mist focus:ring-2 focus:ring-mist/40"
                  autoFocus
                />
              </div>

              {/* Search suggestions */}
              {searchTerm.trim().length < 2 && (
                <div className="mt-5">
                  <p className="font-mark text-[11px] uppercase tracking-[0.18em] text-mist-700">
                    Try
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {["Komodo", "Raja Ampat", "Banda Sea", "family", "whale shark", "private charter"].map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => setSearchTerm(term)}
                        className="rounded-full border border-sand-300 px-3 py-1.5 font-mark text-[11px] uppercase tracking-[0.14em] text-ink-700 transition hover:border-mist hover:bg-sand"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty search state */}
              {searchTerm.trim().length >= 2 && (
                <div className="mt-5 py-10 text-center">
                  <p className="font-display text-xl text-ink-700">
                    Nothing matched &ldquo;{searchTerm}&rdquo;
                  </p>
                  <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink/70">
                    Try an island, a boat name or a month. Or tell us what you are after —
                    half of what we run never makes it onto a search page.
                  </p>
                  <Link
                    href="/contact"
                    className="mt-5 inline-flex h-11 items-center rounded-full bg-ink px-5 font-mark text-sm uppercase tracking-[0.12em] text-white transition hover:bg-ink-600"
                    onClick={closeAll}
                  >
                    Talk to the familia
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ---------- Mobile drawer ---------- */}
      {open === "menu" && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="absolute inset-0 bg-ink-950/60 animate-fade-in" onClick={closeAll} />
          <div className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-ink text-white animate-[sheet-right_0.3s_cubic-bezier(.22,1,.36,1)_both]">
            {/* Drawer header */}
            <div className="flex h-16 shrink-0 items-center justify-between px-5">
              <span className="flex items-center gap-2.5 text-white">
                <span className="icon icon-mark h-8 w-auto" aria-hidden="true" />
                <span className="font-mark text-[13px] uppercase tracking-[0.28em]">Sea Familia</span>
              </span>
              <button
                type="button"
                onClick={closeAll}
                aria-label="Close"
                className="grid h-10 w-10 place-items-center rounded-full text-white/80 transition hover:bg-white/10"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            {/* Drawer nav */}
            <div className="flex-1 overflow-y-auto px-5 pb-6">
              <nav aria-label="Primary mobile">
                {NAV_ITEMS.map((item, i) => (
                  <Link
                    key={item.key}
                    href={item.href}
                    className={cn(
                      "flex items-baseline justify-between border-b border-white/10 py-4 text-white",
                      pathname === item.href && "text-flame-300"
                    )}
                    onClick={closeAll}
                  >
                    <span className="font-display text-3xl">{item.label}</span>
                    <span className="font-mark text-[11px] tracking-[0.2em] text-white/40">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </Link>
                ))}
              </nav>

              {/* CTAs */}
              <div className="mt-6 grid gap-2">
                <Link
                  href="/experiences"
                  className="flex h-12 items-center justify-center gap-2 rounded-full bg-flame font-mark text-[12px] uppercase tracking-[0.16em] text-white"
                  onClick={closeAll}
                >
                  Plan your trip
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
                <Link
                  href="/charter"
                  className="flex h-12 items-center justify-center rounded-full border border-white/25 font-mark text-[12px] uppercase tracking-[0.16em] text-white"
                  onClick={closeAll}
                >
                  Request a charter
                </Link>
              </div>

              {/* WhatsApp */}
              <a
                href="https://wa.me/6281100000000"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center gap-2 font-mark text-[11px] uppercase tracking-[0.16em] text-white/70"
              >
                WhatsApp the office
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
