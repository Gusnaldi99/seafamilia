import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/* ---------- Formatting ---------- */

const MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const MONTHS_LONG = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** Parse an ISO date string (YYYY-MM-DD) into a Date, or null. */
export function parseISO(iso: string | null | undefined): Date | null {
  if (!iso || typeof iso !== "string") return null;
  const p = iso.split("-");
  if (p.length !== 3) return null;
  const d = new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
  return isNaN(d.getTime()) ? null : d;
}

/** Format an ISO date string. */
export function formatDate(iso: string, long = false): string {
  const d = parseISO(iso);
  if (!d) return "—";
  const m = long ? MONTHS_LONG[d.getMonth()] : MONTHS_SHORT[d.getMonth()];
  return `${m} ${d.getDate()}, ${d.getFullYear()}`;
}

/** Format a date range, collapsing shared month/year. */
export function formatDateRange(iso: string, nights: number): string {
  const a = parseISO(iso);
  if (!a) return "—";
  const b = new Date(a.getTime());
  b.setDate(b.getDate() + nights);
  const ma = MONTHS_SHORT[a.getMonth()];
  const mb = MONTHS_SHORT[b.getMonth()];
  const sameMonth =
    a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
  return sameMonth
    ? `${ma} ${a.getDate()}–${b.getDate()}, ${b.getFullYear()}`
    : `${ma} ${a.getDate()} – ${mb} ${b.getDate()}, ${b.getFullYear()}`;
}

/** Format a month label from an ISO date string. */
export function formatMonth(iso: string): string {
  const d = parseISO(iso);
  if (!d) return "—";
  return `${MONTHS_LONG[d.getMonth()]} ${d.getFullYear()}`;
}

/** Format USD price with Intl. */
export function formatMoney(usd: number | null | undefined): string {
  if (usd === null || usd === undefined || isNaN(Number(usd))) {
    return "On request";
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(usd);
}

/** Format nights. */
export function formatNights(n: number): string {
  return `${n} ${n === 1 ? "night" : "nights"}`;
}

/** Format guests. */
export function formatGuests(n: number): string {
  return `${n} ${n === 1 ? "guest" : "guests"}`;
}
