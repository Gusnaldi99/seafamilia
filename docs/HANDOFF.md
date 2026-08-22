# Sea Familia — frontend handoff

Next.js (App Router) + Tailwind v4 + shadcn/ui. This supersedes the static HTML/
Alpine.js build documented in `legacy/docs/HANDOFF.md` — that document, and the static
site it describes, are preserved for reference (and tagged in git as
`v1.0-static-handoff`) but are no longer the live deliverable.

- Live component/state inventory: **`/design-system`** (noindex) — every card, skeleton,
  empty/error state and shadcn primitive on one page.
- Design tokens: `app/globals.css`'s `@theme` block.
- Content layer: `lib/data/*` (one module per entity) + `lib/queries.ts` (lookups/filters).
- Route map: this document, §2.
- The original spec this was built from: `legacy/docs/HANDOFF.md` — read it for *why*
  a lot of the content and interaction decisions were made; this document is deliberately
  shorter because it only needs to describe what changed and what's true now.

---

## 1. Running it

```bash
npm install
npm run dev      # → http://localhost:3000, Turbopack
npm run build    # production build — also the fastest way to typecheck everything
npm start        # serve the production build
npm run lint     # ESLint, including React Compiler's hook-safety checks
npm run test     # Vitest — data integrity, card renderers, reserve pricing math
```

No `.env` is required to run it. `NEXT_PUBLIC_SF_QA=1` (see §7) is the only environment
variable the app reads, and it's optional even in production.

**Nothing is fetched from a third-party origin at runtime.** Fonts are self-hosted via
`next/font/google` (subsetted, preloaded, no render-blocking network request); there is
no CDN script, no analytics beacon, no remote image host. Every photo is a `.ph-<variant>`
gradient placeholder — no photography has been shot yet (see §9) — so the app also has
zero image requests in its current state.

---

## 2. Route → screen map

App Router file paths map directly to URLs; the table below is for cross-referencing
against the legacy site's screens, not because the mapping is non-obvious.

| Section | Route | File | Params |
|---|---|---|---|
| Discover | `/` | `app/page.tsx` | — |
| | `/experiences`, `/experiences/[slug]` | `app/experiences/` | 6 |
| | `/destinations`, `/destinations/[slug]` | `app/destinations/` | 8 |
| Choose | `/boats`, `/boats/[slug]` | `app/boats/` | 4 |
| | `/itineraries/[slug]` | `app/itineraries/[slug]/` | 12 |
| | `/destinations#itineraries` | section on `/destinations`; `/itineraries` (bare) redirects here via `proxy.ts` | — |
| | `/departures`, `/departures/[id]` | `app/departures/` | 16 |
| Convert | `/plan` | `app/(funnel)/plan/` | — |
| | `/reserve` | `app/(funnel)/reserve/` | — |
| | `/charter` | `app/(funnel)/charter/` | — |
| Trust | `/our-story`, `/faq`, `/contact`, `/policies`, `/partners` | `app/<name>/` | — |
| | `/journal`, `/journal/[slug]` | `app/journal/` | 8 |
| System | `not-found.tsx` (root + one per detail segment) | | — |
| | `error.tsx` / `global-error.tsx` / `/maintenance` | | — |
| | `/design-system` | `app/design-system/` (noindex) | — |
| | `/sitemap.xml`, `/robots.txt` | `app/sitemap.ts`, `app/robots.ts` | — |

Legacy `*.html?query` URLs redirect to their clean equivalents via `proxy.ts` (Next 16
renamed `middleware.ts` → `proxy.ts`/`proxy()` — see its file comment if that looks like a
typo). Detail-page query params (`?slug=`, `?id=`) become path segments; every other
param (filters, `?state=`, funnel entry params) carries over verbatim since the param
names are unchanged from the legacy site.

**Naming decisions**, in case they look arbitrary: `/itineraries/[slug]` not
`/trips/[slug]` (every user-facing string says "itinerary"); `/plan` not `/discover`
(matches the header CTA "Plan your trip"); `/design-system` not `/components` (would
collide with the repo's own `components/` directory).

---

## 3. The three funnels

Each of `/plan`, `/charter`, `/reserve` uses a different state pattern, on purpose — not
an inconsistency to fix:

| | `/plan` | `/charter` | `/reserve` |
|---|---|---|---|
| State | Plain `useState`, synced to the URL via `router.push`/`replace` | One `react-hook-form` instance for the whole enquiry; `step` is local state | `useReducer` (`features/reserve/state.ts`) |
| Why | Every other filtered listing in the app already uses this pattern; a server round-trip per button click would be slower than the original's zero-latency Alpine reactivity | One flat object, no business-transition logic between fields | Choosing a cabin can silently reshape the guest count; guest-count changes resync the guest-detail list. These are state *transitions*, which map onto reducer actions far more directly than form-field bindings |
| Validation | None needed (button selections only, no free text) | `zod` schema with `superRefine` for the date/group cross-field rules, resolved via `@hookform/resolvers` | Plain `validateStep(state, step)` function (features/reserve/state.ts), ported directly from the original's `validate()` |
| Persistence | None (URL is sufficient) | `sessionStorage` key `sf.charter`, autosaved via `form.watch()` | `sessionStorage` key `sf.reserve`, autosaved via an effect |
| Submit | — | Server Action `submitCharterEnquiry` (`app/(funnel)/charter/actions.ts`) | Server Action `submitReservation` (`app/(funnel)/reserve/actions.ts`) |

All three submits are still fakes — an `await sleep()` and a canned success/failure,
gated by the same `?state=error` override every listing page respects (§7). Swapping in
a real backend is a one-function change per funnel; the payload shape is already what a
real endpoint would want.

**Two bugs in the original site were fixed during the port, not just preserved:**

1. **`/plan`'s "no preference" answer now reaches the URL.** The original's `href()`
   helper silently dropped empty-string query values, so choosing "no preference" on any
   of the four questions was indistinguishable from not having answered yet once it
   round-tripped through a URL — a documented QA deep link for the step-5 empty state
   actually landed on step 4. Fixed by serializing "no preference" as the explicit
   sentinel `?key=any`; only a genuinely absent param means "unanswered"
   (`encodeAnswer`/`decodeAnswer` in `app/(funnel)/plan/guided-discovery.tsx`).
2. **`/reserve`'s guest names now survive a reload.** The original's `persist()` saved
   `{depId, cabinCode, guests, lead, chosenExtras}` to sessionStorage but never
   `guestList` — so every typed name, nationality, diving level and dietary note (and
   even the *lead* guest's own name specifically, which lives in a different field than
   their email/phone) vanished on a mid-step-5 reload. `guestList` is now part of the
   persisted shape (`PersistedReserve` in `features/reserve/state.ts`).

Shared funnel components live in `components/funnel/` (`FunnelStepper`, `FunnelFooter`,
`IndeterminateBar`) and `components/form/Stepper` (the −/+ counter — no shadcn
equivalent). `app/(funnel)/layout.tsx` sets `<body data-sticky-bar>`, which
`RevealSections` (the global scroll-reveal) checks and skips — the funnels' own step
transitions are the animation.

---

## 4. Data contract

One module per entity under `lib/data/`, each exporting a plain array — this *is* the
seam for a future backend: change an export to `async function getX()`, `await` it at
the call sites, and no markup changes. Verified counts (the original spec had drifted
from the real data by the time this port started — these are the numbers that matter
now):

| Entity | Count | Module |
|---|---|---|
| Trips (itineraries) | 12 | `lib/data/trips.ts` |
| Waters (destinations) | 8 | `lib/data/waters.ts` |
| Boats | 4 | `lib/data/boats.ts` |
| Departures | 16 | `lib/data/departures.ts` |
| Experiences | 6 | `lib/data/experiences.ts` |
| Articles (journal) | 8 | `lib/data/articles.ts` |
| Team | 6 | `lib/data/team.ts` |
| FAQ | 12 (3 groups) | `lib/data/faq.ts` |
| Lengths / parties (taxonomy) | 3 / 4 | `lib/data/taxonomy.ts` |

Types are string-typed (`water: string`, not a literal union of today's 8 slugs) so a
9th water doesn't require a type change — referential integrity is enforced by
`lib/data/__tests__/integrity.test.ts` instead. Pure lookups/filters live in
`lib/queries.ts` (`filterTrips`, `filterDepartures`, `waterBySlug`, `deriveCabinInventory`,
`search`, …) — safe to import from both Server and Client Components (no `server-only`
guard). `lib/photo.ts` (the actual filesystem check) *does* carry `server-only`; its
client-safe half (`photoPath`, `PHOTO_SIZES`, `LITERAL_PHOTOS`) is split into
`lib/photo-paths.ts` for exactly that reason — see any client-island component that
renders `PhotoPlate` instead of `PhotoSlot` for the pattern.

**Open item, unchanged from the original spec:** `Departure` has no real per-date cabin
inventory (`cabins: [{code, left, price}]`). `deriveCabinInventory()`
(`lib/queries.ts`) derives it from the boat's catalogue grades capped by
`departure.cabinsLeft` — isolated behind that one function so replacing it with real
data later is a one-function change, not a page-by-page hunt.

---

## 5. Design system

Every token lives in one `@theme` block in `app/globals.css` — the 5-hue brand ladder
(`ink`/`deep`/`flame`/`mist`/`sand`), `--container-8xl`, custom radii/shadows/easing, and
the shadcn semantic tokens (`--color-primary`, `--color-border`, etc.) mapped onto the
same brand palette so both naming systems produce real utilities. No dark-mode tokens —
the brand never used them.

shadcn primitives live in `components/ui/`, patched on install: `outline-none` and the
generated focus-ring classes were stripped from every primitive so the site's global
`:focus-visible` outline rule stays the one focus language (shadcn's default ring
otherwise silently overrides it — this was called out as the single most likely thing to
regress accessibility during the port, and is worth re-checking if a shadcn component is
ever regenerated via the CLI).

Icons are inline SVG components (`components/icons/`, generated via SVGR from
`design/icons/`), not the legacy build's CSS-mask (`icon-*` class) convention — that
convention existed only because the old build had no way to inline SVG from a JS
template string. `lucide-react` remains a dependency solely because shadcn's own
`Select`/`Accordion`/`Dialog`/`Sheet` import it internally.

---

## 6. Images

`PhotoSlot` (Server Component) wraps `next/image` inside the `.ph-<variant>` gradient
placeholder; `PhotoPlate` is its client-safe half (no filesystem check — takes an
already-resolved `src: string | null`), used by any client island that can't import
`server-only` code. Photo existence is checked **server-side**
(`photoIfExists()`) rather than a client `onerror` handler, so with zero real photography
shot so far, the gradient renders alone with zero image requests rather than every
`<img>` 404ing. Path convention is unchanged from the legacy build —
`/assets/media/photos/<kind>/<slug>.jpg` — specifically so the legacy handoff's asset
manifest (a contract with whoever shoots the photography) stays valid.

---

## 7. QA state overrides

Every listing and funnel page respects `?state=loading|empty|error` for stakeholder
demos, ported from the legacy `SEA.forcedState()` convention (`lib/qa.ts`). Gated to
non-production by default (`NODE_ENV !== 'production'`) so a real visitor can't force a
fake error; set `NEXT_PUBLIC_SF_QA=1` to enable it on a production/preview deployment
anyway.

---

## 8. Currency & language

`components/providers/locale-provider.tsx` replaces the legacy `SEA.store` — one React
Context (`useLocale()`) exposing `currency`, `lang`, `t()`, `money()`, `date()`, etc.,
backed by `localStorage` under the **same keys** (`sf.currency`, `sf.lang`) the legacy
site used, so a returning visitor's preference survives the migration. Currency/language
choice is still client-only (no cookie, no server-rendered price in the visitor's
currency) — the same tradeoff the original spec made, to keep the 54 detail pages
statically generated rather than forced dynamic.

---

## 9. Production checklist

Items already closed by this migration that used to be open (kept here so the list
doesn't silently drop them from history): Tailwind compiling and self-hosted fonts were
already done pre-migration; this port additionally closed reference-number generation
moving server-side (item 6 in the legacy checklist) and wired real 404/500/maintenance
pages instead of static files.

Still open:

1. **Replace the fake submits** in `/contact`, `/charter`, `/reserve` Server Actions with
   real requests. Keep the `loading → ready | ok | error` contract and the `?state=error`
   QA hook.
2. **Real per-date cabin inventory** — see §4's open item.
3. **Shoot the photography.** Every image manifest path in §6 is already correct; drop
   files in and the gradient placeholders disappear with no code change.
4. **Refresh FX rates on a schedule** (`lib/i18n/currencies.ts`) — currently a static
   snapshot, same as the legacy build.
5. **Add a hero video** for the homepage — currently a static gradient (`.ph-reef`); the
   legacy build's stand-in remote clip was dropped entirely rather than ported, since it
   was already flagged there as a placeholder.
6. **Wire a real Vercel/hosting deployment.** No project is linked yet — see the repo
   root README for the current manual-deploy state.

---

## 10. Deliberately not built

Named so they're decisions, not gaps: real authentication (the sign-in dialog validates
and shows success with no session), payment capture (the flow ends at held cabins with a
payment link to follow, by design), a live availability socket (read once per page load),
full-page i18n (chrome/controls only — body copy is editorial and un-translated, same as
before).

**No longer on this list:** multi-cabin bookings. A reservation now holds any number of
cabins, each with its own party — `ReserveState.selections`, capped per grade by the
derived inventory and overall by `Departure.cabinsLeft`. Larger parties are no longer
pushed to the office.

Related: per-guest details (name, nationality, diving, dietary) are no longer collected
during the funnel. Step 5 takes contact details only, and `/joining-form` collects the
rest after the deposit — reached from the confirmation screen, and in production from the
link the office emails. Since there is no booking store, that form cannot look a reference
up; the guest adds a row per person instead.

---

## 11. Verification

```bash
npm run lint     # ESLint + React Compiler checks
npm run test     # Vitest: lib/data integrity, card renderers, reserve pricing math
npm run build    # typechecks the whole app; also the fastest way to catch a broken import
```

There's no standing Playwright suite committed to the repo — every phase of this
migration was verified with an ad hoc Playwright pass (screenshots, interaction
walkthroughs, console-error checks) run against a local `next dev` server, not a
regression suite that runs in CI. Worth building one before this ships somewhere with
real traffic; `docs/` in this repo's git history has the phase-by-phase verification
notes if useful groundwork.

---

## 12. Legacy reference

The static HTML/Alpine.js site this was ported from lives in `legacy/` at the repo
root, and the exact pre-migration snapshot is tagged `v1.0-static-handoff` in git. Its
own `legacy/docs/HANDOFF.md` is the fuller spec this document intentionally doesn't
repeat — read it for the original content/interaction rationale. `legacy/` is not run or
built as part of this app; it's kept for reference and pixel-diffing only.
