# Sea Familia — frontend handoff

UI/UX + HTML/CSS/JS slicing deliverable. Answers the three things `readme.md` asks
for at handoff: a **route-to-screen map**, a **data contract per component**, and an
**interaction contract**.

- Live component inventory: **[components.html](../components.html)** — every component
  and every runtime state on one page, rendered from the same code the real pages use.
- Design tokens: `tailwind.config.js`
- Content + presentation layer: `assets/js/data.js`
- Global chrome: `assets/js/layout.js`
- Shared `<head>` assets: `partials/assets.html`

---

## 1. Running it

**Running it needs nothing installed. Changing the design needs npm.** Those are two
different activities and it matters which one you are doing.

### Just look at it

Every page is static HTML — no build step at runtime, no framework, no server-side
render. The compiled CSS ships with the deliverable, so a fresh copy of this folder
works as-is. It even works from `file://`, though a real origin is better because the
funnels use `history.replaceState`:

```bash
# from the project root — needs only Node, no install
node tools/serve.js          # → http://localhost:8080/index.html
node tools/serve.js 3000     # a different port
```

`tools/serve.js` also returns `404.html` with a real 404 for unknown paths, which is the
behaviour the production server should copy (see §2).

**Nothing is fetched from a third-party origin.** Tailwind, Alpine and the three fonts
are all local, so the site renders identically behind a firewall or with the network
off. The single exception is a stand-in hero clip on `index.html` (see §9); it sits
behind `preload="none"` and an SVG poster, so an unreachable network costs only the
motion. `tools/check-pages.js` fails the build if any other remote asset appears.

### Change the design

```bash
npm install                  # tailwindcss 3.4.19 + forms + typography
npm run css                  # → assets/css/tailwind.css
npm run css:watch            # rebuild on save, while you work
npm run css:min              # → assets/css/tailwind.min.css, for production
```

Tokens live in **`tailwind.config.js`** at the project root. Add a class in markup
without rebuilding and it silently has no rule — `npm run css:check` catches exactly
that (§13).

`node_modules/` is a build-time dependency only. Do not ship it; ship the compiled
`assets/css/tailwind.css`. For a machine with no npm, the standalone `tailwindcss`
executable for v3.4.19 has the forms and typography plugins built in and takes the
same flags.

### Asset order

Each page loads these, in this order, from `partials/assets.html`:

```html
<link rel="preload" href="assets/fonts/…-latin.woff2" as="font" crossorigin>  <!-- ×3 -->
<link rel="stylesheet" href="assets/css/fonts.css">      <!-- @font-face, generated -->
<link rel="stylesheet" href="assets/css/tailwind.css">   <!-- compiled -->
<link rel="stylesheet" href="assets/css/app.css">        <!-- hand-written, last word -->
<script src="assets/js/data.js"></script>                <!-- classic: defines window.SEA -->
<script defer src="assets/js/vendor/alpine-3.14.9.min.js"></script>
...
<script src="assets/js/layout.js"></script>              <!-- LAST in <body> -->
```

Two ordering rules, both asserted by `tools/check-pages.js`:

1. **`tailwind.css` before `app.css`.** `app.css` holds what Tailwind cannot express and
   is meant to have the last word. (In practice nothing collides — the only class name
   both files use is `.font-display`, and they set different properties.)
2. **`layout.js` last in `<body>`.** It is a classic script, so it runs during parsing —
   before the deferred Alpine bundle boots — which is what guarantees `seaChrome()` and
   `seaNewsletter()` exist by the time Alpine initialises the header and footer markup.

### Page contract

The global chrome is **static HTML in every page**. Canonical source lives in `partials/`
and is written into each page between marker comments:

```html
<head>
<title>…</title>                 <!-- per page, above the block -->
<meta name="description" …>      <!-- per page -->
<!-- sea:assets · static — edit partials/assets.html, then: node tools/sync-partials.js -->
  …font preloads, fonts.css, tailwind.css, app.css, data.js, Alpine…
<!-- /sea:assets -->
</head>

<body class="bg-white font-sans text-ink antialiased"
      data-page="departures"   <!-- build-time: which nav item lights up -->
      data-sticky-bar>         <!-- build-time: funnel owns the bottom edge, so the
                                    floating WhatsApp button is omitted -->

<!-- sea:header · static — edit partials/header.html, then: node tools/sync-partials.js -->
  …skip link, utility bar, header + nav, search panel, drawer, sign-in modal…
<!-- /sea:header -->

<main id="main"> … </main>     <!-- required, target of the skip link -->

<!-- sea:footer · static — edit partials/footer.html, then: node tools/sync-partials.js -->
  …footer, then partials/help.html unless data-sticky-bar…
<!-- /sea:footer -->
<script src="assets/js/layout.js"></script>
</body>
```

### Changing the chrome or the assets

Never edit the blocks in a page — edit the partial and re-run the writer:

```bash
node tools/sync-partials.js              # write every page
node tools/sync-partials.js index.html   # write one page
node tools/sync-partials.js --check      # report drift only, exit 1 (CI)
```

| File | Contents |
|---|---|
| `partials/assets.html` | The shared `<head>`: font preloads, three stylesheets, `data.js`, Alpine |
| `partials/header.html` | Skip link, utility bar, sticky header + nav, search panel, mobile drawer, sign-in modal |
| `partials/footer.html` | Brand + newsletter, four link columns, legal bar |
| `partials/help.html` | Floating WhatsApp button, desktop only |
| `tools/sync-partials.js` | The writer. Also owns `ROUTE_NAV`, the page → nav-item map |

Adding a stylesheet, bumping Alpine or preloading another font is therefore **one edit in
one file** followed by a sync, not 23 hand edits.

Two things vary per page, and the writer handles both:

- `aria-current="page"` lands on the nav anchor whose `data-nav` matches the page. The
  group comes from `<body data-page="…">` when present, otherwise from `ROUTE_NAV` — which
  is how detail pages light up their parent section (`trip.html` → Destinations).
- `partials/help.html` is skipped when the page carries `data-sticky-bar`.

`tools/check-pages.js` calls the drift checker, so a page edited by hand fails CI.

Because the chrome is real markup, the nav is crawlable, the page renders with a working
header and footer even with JavaScript disabled, and `partials/` maps 1:1 onto whatever
include system the backend uses (`header.blade.php` and friends).

---

## 2. Route → screen map

The 26 minimum screens from `readme.md` §"Minimum screens", all present.

### Marketing & discovery

| # | Brief screen | File | Notes |
|---|---|---|---|
| 1 | Homepage | `index.html` | Hero video, three paths, editor's pick, itineraries index, next departures, waters, fleet, open-trip vs charter, journal, trust |
| 2 | Experience listing | `experiences.html` | 6 tiles + filter (waters / length / party) → matching trips |
| 3 | Experience detail | `experience.html?slug=diving` | 6 slugs: `diving` `family` `remote` `culture` `wellness` `light` |
| 4 | Destination listing | `destinations.html` | Waters grid (arch cards) + season table + all itineraries |
| 5 | Destination detail | `destination.html?slug=komodo` | 8 slugs, see §5 |
| 6 | Boat listing | `boats.html` | 4 boats + "which one" guidance + spec comparison table |
| 7 | Boat detail | `boat.html?slug=familia-satu` | Specs, cabins, facilities, safety, deck summary, trips, dates |
| 8 | Journey listing | `destinations.html#itineraries` | Grid form. Dense index form on `index.html#itineraries` |
| 9 | Journey detail | `trip.html?slug=manta-passage` | Day-by-day accordion, gallery + lightbox, inclusions, boat, dates |

### Search & conversion

| # | Brief screen | File | Notes |
|---|---|---|---|
| 10 | Departure search | `departures.html` | Sticky filter bar, results grouped by month |
| 11 | Departure detail | `departure.html?id=SFD-2609-TVR` | Trip summary, route recap, cabin availability, other dates |
| — | Plan your trip | `discover.html` | Guided discovery, 5 steps — the brief's "Plan your trip" |
| 12 | Cabin selection | `reserve.html?step=3` | |
| 13 | Guest count | `reserve.html?step=4` | Adult / teen / child + occupancy validation |
| 14 | Guest details | `reserve.html?step=5` | Lead guest + per-guest nationality, diving, dietary |
| 15 | Review & reserve | `reserve.html?step=6` | Breakdown, voucher, deposit, consent |
| 16 | Booking confirmation | step 7 of `reserve.html` | Reference, payment status, next steps, print |
| 17 | Private-charter inquiry | `charter.html` | 5 steps: intro → dates & group → preferences → contact → sent |

### Trust & support

| # | Brief screen | File |
|---|---|---|
| 18 | Our story | `our-story.html` — founding story, values, sustainability, `#familia` |
| 19 | FAQ | `faq.html` — 12 questions, 3 groups, searchable |
| 20 | Contact | `contact.html` — 6 topics, channels, office hours |
| 21 | Journal listing | `journal.html` — featured, search, category filter, grid |
| 22 | Article detail | `article.html?slug=reading-the-current` |
| 23 | Policies | `policies.html` — `#privacy` `#terms` `#cancellation` `#safety` `#accessibility` |
| 24 | Partner / travel agent | `partners.html` — commission tiers, process, assets, fam places |
| 25 | Global 404 | `404.html` — searches for the slug that failed |
| 26 | Global error / maintenance | `error.html` and `error.html?mode=maintenance` |
| + | Component inventory | `components.html` — internal, `noindex` |

**Server config needed:** point the 404 handler at `404.html` and the 5xx handler at
`error.html`. Neither is linked from the chrome (by design).

---

## 3. The four journeys

### A. Browse & inspire — no funnel
`index.html` → `destinations.html` → `destination.html` → `trip.html` → `#dates` → `departure.html`

Free movement in any order. Every discovery card is a link; nothing is gated.

### B. Guided discovery — 5 steps (`discover.html`)

| Step | Question | State key | Skippable |
|---|---|---|---|
| 1 | What do you most want out of the week? | `experience` | yes — "Not sure yet" |
| 2 | Which water pulls at you? | `water` | yes — "Surprise me" |
| 3 | How long can you be away? | `length` | yes — "Flexible" |
| 4 | Who is coming with you? | `party` + `guests` | yes |
| 5 | Matches | — | — |

- `''` means *no preference* (a deliberate answer); `null` means *unanswered*.
- Every option shows a live match count, so no one picks a dead end blind.
- Step 5 empty state offers **relax-one-answer** buttons ranked by resulting match count.
- Deep-linkable and history-aware: `discover.html?step=3&experience=diving&water=banda`.
  Browser Back walks the funnel rather than leaving it (`pushState` + `popstate`).

### C. Reserve a cabin — 7 steps (`reserve.html`)

`search → trip summary → cabin → guests → details → review → confirmation`

- Sticky summary panel throughout: right rail from `lg`, bottom sheet below it
  (tap the running total in the funnel footer).
- Step gating via `firstIncomplete()` — nobody lands in a step they have not earned,
  even with a hand-edited URL.
- Answers survive a reload in `sessionStorage` (`sf.reserve`), cleared on success.
- Entry points: `departure.html` → `reserve.html?dep=<id>&step=3`, or per cabin
  `reserve.html?dep=<id>&cabin=<code>&step=3`.
- Pricing: adults 100%, teens 90%, children 75% of the cabin's per-person fare;
  extras added per person or per group; voucher applies to the cabin fare only.
- Test vouchers: `FAMILIA10` (10%), `RETURNING` (5%), `AGENT15` (15%).

### D. Boats & private charter — 5 steps (`charter.html`)

`intro → dates & group → preferences → contact → request sent`

- Step 1 is **not a form** — day rates, inclusions and process first.
- Validation is per step, so nobody meets a wall of errors at the end.
- Answers survive a reload in `sessionStorage` (`sf.charter`) — charter groups routinely
  leave to ask someone else and come back.
- Entry with context: `charter.html?boat=nusa-ombak&step=2`.

---

## 4. Design system

### Colour

| Token | Hex | Use |
|---|---|---|
| `deep` | `#780000` | Prices, quiet headings, footer wash |
| `flame` | `#C1121F` | Primary action, accent, active nav |
| `white` | `#FFFFFF` | Page ground, cards |
| `ink` | `#003049` | Body text, dark sections, header |
| `mist` | `#669BBC` | Secondary, water, meta text, quiet UI |
| `sand` | `#F7F5F2` | Alternating sections, input fills — sampled from `logo-light.png` |

Numbered steps (`ink-900`, `mist-300`, `flame-600`…) are tints/shades of those six.
**No other hues exist in the build.**

### Type

| Family | Token | Role |
|---|---|---|
| Fraunces 300–400 | `font-display` | Headlines, pull-quotes, figures in data cells |
| Jost 300–500 | `font-mark` | Wordmark, nav, eyebrows, buttons, data labels — always wide-tracked |
| Inter 300–600 | `font-sans` | Body, forms, tables |

`text-eyebrow` = 11px / `0.22em` tracking / uppercase — the standard section kicker.

All three are **self-hosted variable fonts** (`assets/fonts/`, `@font-face` in
`assets/css/fonts.css`), Latin + Latin-Extended subsets only. Fraunces carries the
optical-size axis, which `app.css` opts into with `.font-display { font-optical-sizing:
auto }`. Regenerate with `node tools/vendor.js fonts` — that script owns the font request,
so changing weights or adding a subset is one edit there.

### Motifs from the logo

| Class | Origin | Used on |
|---|---|---|
| `.arch`, `.arch-soft` | the dome framing the phinisi | Destination cards, portraits, avatars |
| `.wave-rule` (+`-flame`, `-light`) | the three dashed lines under the wordmark | Section dividers |
| `assets/media/mark.svg` | the lockup, emblem only | Header + mobile drawer, `currentColor` |

`assets/logo/logo-light.png` is used at full lockup in the footer.

### Form card legends

Every funnel step is a stack of `<fieldset class="rounded-2xl bg-white p-5 lg:p-6">` cards, and
each one is titled by its `<legend>` — so the group name is the accessible name of the group, not
a `<div>` sitting next to it. The header pattern is:

```html
<legend class="sf-legend flex items-center gap-3 pb-3 font-mark text-[11px] font-medium uppercase tracking-[0.18em] text-ink-700">
  <span class="h-3.5 w-[3px] shrink-0 rounded-full bg-flame"></span>  <!-- flame tick -->
  <span>Dates</span>
  <span class="h-px flex-1 bg-sand-300"></span>                        <!-- trailing hairline -->
</legend>
```

`.sf-legend` (two rules in `app.css`) is the load-bearing part. A legend is normally lifted onto
the fieldset's block-start edge, and the fieldset's background only starts painting at the
legend's vertical middle — so on a borderless white card the label rendered *outside* the card,
on the sand. Floating the legend opts out of that rendering (per the HTML rendering spec a
floated legend is no longer the "rendered legend") and it lays out as an ordinary block inside
the card's padding; `.sf-legend + *` then clears the float. The `pb-3` is a floor for the gap
under the header — clearance takes it or the next block's `mt-*`, whichever is larger, so each
card still tunes its own spacing in the markup.

Used by `charter.html` (8 cards) and `reserve.html` (2). The filter-panel legends in
`experiences.html` and the topic legend in `contact.html` are group labels on transparent
fieldsets, not card headers, and stay plain.

### Active nav

The only per-page difference in the header is one attribute. All styling is in `app.css`:

```css
nav[aria-label="Primary"] a[aria-current="page"] { color: var(--sf-flame); }
nav[aria-label="Primary"] a[aria-current="page"]::after { /* the 1px underline */ }
nav[aria-label="Primary mobile"] a[aria-current="page"] { color: #e4737a; }
```

`nav[…] a[aria-current]` is specificity (0,2,1), so it beats the `.text-ink-700` (0,1,0)
and `.hover\:text-flame-600:hover` (0,2,0) utilities every anchor carries. That is what
lets all 23 copies of the nav stay byte-identical.

### Motion

Two behaviours, both global, both driven from `layout.js` with the visual states in `app.css`.

**Sticky header.** Sticks at every width. The Alpine wrapper around the chrome carries
`class="contents"`, and that is load-bearing: a `position: sticky` element is constrained to
its containing block, and without `display: contents` the wrapper generates a ~116px box, so
the header unsticks almost immediately. Past 72px of scroll, `layout.js` sets
`data-compact="true"` on the `header` element and `app.css` shortens the bar from 80px to
64px (56px on mobile), shrinks the emblem, and swaps the translucent background for a solid
one with a shadow. The base heights stay as plain Tailwind classes so the header is correct
with JavaScript off; the compact overrides win on attribute-selector specificity.

**Reveal on scroll.** One `IntersectionObserver` fades every `main > section` in with a 16px
rise, 0.7s, once. Three deliberate constraints:

- The hidden state (`data-reveal`) is **only** applied from JavaScript, so nothing is ever
  invisible without it.
- Sections already on screen when the script runs are marked visible in the same tick — the
  hero never animates, and there is no flash.
- It ends at `transform: none`, not `translateY(0)`, so no lingering transform is left to
  become a containing block for `lg:sticky` children inside a section.

Opted out: `prefers-reduced-motion: reduce`, and the three funnel screens (`data-sticky-bar`)
whose steps already animate via `x-transition`. Detail pages render their body inside
`<template x-if>`, so their sections are armed from the same `MutationObserver` that
re-formats prices.

### Layout

| Breakpoint | Behaviour |
|---|---|
| `< 640` | Single column, sticky bottom actions, rails snap-scroll |
| `640–1023` | Two-column grids, filters stack, no sticky rail |
| `1024–1279` | Full nav, three-column grids, summary rail appears |
| `≥ 1280` | Editorial split layouts, wider gutters, `max-w-8xl` (88rem) cap |

Section rhythm: `py-14 lg:py-20`, gutters `px-5 sm:px-6 lg:px-8`.
Controls are 44px minimum, 48px in funnels.

---

## 5. Data contract

Everything a screen renders comes from `window.SEA`. Replace the arrays with API
responses and the markup does not change.

**Global rules**

- Prices: **integer USD per person**, tax inclusive. The client formats. Never send a
  formatted string, never send a float with cents.
- Dates: **`YYYY-MM-DD`** only. Never a localised string.
- Every record needs a stable `slug` (or `id`), used in the URL.
- Optional fields must have a documented fallback — see the tables below.
- Unknown enum values must not reach the UI raw; `SEA.badge()` falls back to `open`.

> **Three lists are duplicated as literal markup in `partials/`** because the chrome is
> static and cannot read `SEA`. If you change these in `data.js`, change the partial too —
> the banner comment at the top of each partial says so as well:
>
> | In `data.js` | Mirrored in |
> |---|---|
> | `SEA.CURRENCIES` keys | currency `<option>`s, `partials/header.html` (two places) |
> | `SEA.lengths` (3 buckets) | *Passages* column, `partials/footer.html` |
> | `SEA.waters`, first 6 | *Waters* column, `partials/footer.html` |

### Experience

| Field | Type | Req | Fallback / notes |
|---|---|:--:|---|
| `slug` | string | ● | URL key |
| `name` | string | ● | |
| `ph` | enum | ● | Placeholder variant, see §7 |
| `icon` | SVG inner markup | ● | Rendered into a 24-grid `<svg>` via `x-html` |
| `tagline` | string | ● | |
| `blurb` | string | ● | 2–3 sentences |
| `forWho` | string[] | ○ | Section hides when empty |
| `signature` | string[] | ○ | Section hides when empty |

### Water (destination)

| Field | Type | Req | Fallback / notes |
|---|---|:--:|---|
| `slug` `name` `short` | string | ● | `short` is used in cards and chips |
| `ph` | enum | ● | |
| `gateway` | string | ● | Airport / port of embarkation |
| `season` | string | ● | Free text, e.g. `"April – November"` |
| `crossing` | string | ● | Character of the sailing |
| `blurb` | string | ● | Card copy, 1 sentence |
| `story` | string | ● | Detail page, 1 paragraph |
| `highlights` | string[3] | ● | Rendered as a numbered list |
| `stops` | string[] | ● | Anchorage names; also feeds generated routes |
| `bestFor` | experience slug[] | ● | Must resolve, or the filter silently drops it |

### Boat

| Field | Type | Req | Fallback / notes |
|---|---|:--:|---|
| `slug` `name` `type` | string | ● | |
| `ph` | enum | ● | |
| `tagline` `blurb` | string | ● | |
| `length` `beam` `cruise` `sails` | string | ● | Unit-bearing display strings |
| `built` `refit` | number | ● | |
| `cabins` `guests` `crew` `tenders` `decks` | number | ● | |
| `charterDay` | int USD | ● | Per boat per day — charter step 1 and 3 |
| `facilities` | string[] | ● | |
| `safety` | string[] | ● | |
| `gallery` | ph enum[] | ● | Image slots, 4:3 |
| `cabinTypes` | CabinType[] | ● | Minimum 3 grades |

### CabinType

| Field | Type | Req | Fallback / notes |
|---|---|:--:|---|
| `code` | string | ● | Unique per boat; used in `reserve.html?cabin=` |
| `name` `deck` `beds` | string | ● | |
| `occupancy` | number | ● | Standard |
| `maxOccupancy` | number | ● | **Drives guest-count validation** |
| `price` | int USD | ● | Per person, catalogue rate for the boat |
| `left` | number | ● | Catalogue availability; per-date availability overrides it |
| `features` | string[] | ○ | Renders as an inline list |

### Trip (journey)

| Field | Type | Req | Fallback / notes |
|---|---|:--:|---|
| `slug` `title` | string | ● | |
| `water` | water slug | ● | Must resolve |
| `boat` | boat slug | ● | Must resolve |
| `nights` | number | ● | Bucketed by `SEA.lengthOf()` |
| `from` | int USD | ● | Lowest cabin grade |
| `ph` | enum | ● | |
| `experiences` | experience slug[] | ● | Drives the experience filter |
| `party` | enum[] | ● | `couples` `families` `friends` `solo` |
| `gateway` | string | ● | e.g. `"Ambon to Ambon"` |
| `summary` `story` | string | ● | |
| `highlights` | string[3] | ● | |
| `editorPick` | boolean | ○ | Default `false` |
| `route` | `{day,title,text}[]` | ○ | **If absent**, `SEA.routeFor()` builds an outline from the water's `stops` and flags it `provisional` — the trip page then shows an "outline only" note. Never renders blank. |

### Departure

| Field | Type | Req | Fallback / notes |
|---|---|:--:|---|
| `id` | string | ● | `SFD-YYMM-XXX`, shown to guests |
| `trip` | trip slug | ● | Must resolve |
| `boat` | boat slug | ● | May differ from the trip's default boat |
| `start` | ISO date | ● | |
| `nights` | number | ● | |
| `cabinsLeft` | number | ● | Caps the derived cabin inventory |
| `price` | int USD | ● | Per person, base grade, **this date** |
| `status` | enum | ● | `open` `limited` `waitlist` `closed` |
| `deposit` | 0–1 float | ● | e.g. `0.25` |

> **Open item for the API:** `departure.html` and `reserve.html` currently *derive* the
> per-cabin availability and fare for a date from the boat's grades plus
> `cabinsLeft`/`price` (see `selectDeparture()`), so the numbers can never exceed
> `cabinsLeft`. In production, send real per-date cabin inventory:
> `departure.cabins: [{ code, left, price }]` and delete the derivation.

### Article

| Field | Type | Req | Fallback / notes |
|---|---|:--:|---|
| `slug` `title` `dek` `category` | string | ● | |
| `author` `role` | string | ● | Matched against `SEA.team` for the author note |
| `date` | ISO date | ● | |
| `read` | number | ● | Minutes |
| `ph` | enum | ● | |
| `featured` | boolean | ○ | Two featured pieces head the journal |
| `tags` | string[] | ○ | Tags matching a water or experience slug generate the "where this happens" trip block |
| `body` | `{t,v}[]` | ○ | `t` ∈ `p` `h2` `quote`. **If absent**, `SEA.bodyFor()` returns a placeholder body built from the dek — stands in for an unfilled CMS field |

---

## 6. Interaction contract

| Trigger | Expected response | On failure | Persistence |
|---|---|---|---|
| Change a filter | Skeleton → results; URL updated by `replaceState` | Error block + retry; filters kept | URL |
| Select a departure | Advance to step 2; summary panel populates | Stay put, inline notice | `sessionStorage` |
| Select a cabin | Total recalculates; party trimmed if it no longer fits | Cabin stays unselected | `sessionStorage` |
| Change guest count | Occupancy validated live; guest forms added/removed | `+` refuses past `maxOccupancy` | `sessionStorage` |
| Apply a voucher | Discount line + success toast | Inline error naming the likely cause | in-memory |
| Submit reservation | Indeterminate bar → step 7 + reference + toast | Error panel, answers intact, **nothing charged** | cleared on success |
| Submit charter / contact | Success screen with reference + toast | Error panel + alternate email address | cleared on success |
| Switch currency | Every `[data-usd]` node rewritten in place + toast | Falls back to USD formatting | `localStorage` |
| Switch language | Chrome + control labels swap | Falls back to the English string | `localStorage` |
| Sign in | Modal → "check your inbox" success state | Inline validation error | none (prototype) |

### Validation rules in force

- Email: `/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/`
- Reservation step 5: lead guest name, email, phone required; other guests optional
- Reservation step 6: booking terms **and** insurance consent required
- Charter step 2: a date window **or** the flexible checkbox; group ≥ 1; return ≥ departure
- Charter step 4 / contact: name, email, consent required
- Occupancy: `1 ≤ totalGuests ≤ cabin.maxOccupancy`, enforced at the counter *and* at step gating
- All error messages say what to do, not what went wrong. Errors set `aria-invalid="true"`,
  carry `role="alert"`, and the first invalid field receives focus on a failed submit.

### Where the API calls go

Four stand-ins, all with the same shape (`Promise`, resolve/reject):

| Stand-in | Replace with |
|---|---|
| `SEA.load(payload, {delay})` in every listing | `GET` for that collection |
| `submit()` in `reserve.html` | `POST /reservations` |
| `submit()` in `charter.html` | `POST /charter-enquiries` |
| `submit()` in `contact.html` | `POST /messages` |

References are generated client-side by `SEA.fmt.reference()` **for the prototype only** —
in production the server owns the reference and returns it in the response.

---

## 7. Runtime states

Every listing follows one contract: `loading → ready | empty | error`.

Force any of them by appending a query parameter to **any** index or funnel URL:

```
?state=loading     skeletons, held indefinitely
?state=empty       the collection resolves empty
?state=error       the request rejects / the submit fails
```

Examples worth putting in front of a stakeholder:

| URL | Shows |
|---|---|
| `departures.html?state=loading` | Skeleton rows in the loaded card's exact box |
| `destinations.html?state=empty` | Empty state with "clear filters" + an alternative route |
| `journal.html?state=error` | Error block, no raw message, retry offered |
| `reserve.html?state=error&dep=SFD-2609-TFK&step=6` | Submit fails; answers intact, nothing charged |
| `destinations.html?water=komodo&length=long#itineraries` | A *genuinely* empty filter — no long crossings run in Komodo |
| `discover.html?step=5&experience=culture&water=triton&length=short` | Funnel empty state with relax-one-answer suggestions |
| `error.html?mode=maintenance` | 503 planned-maintenance variant |
| `trip.html?slug=nope` · `boat.html?slug=nope` · `departure.html?id=nope` | Per-entity not-found screens, each with a way onward |

`?state=empty` works through `SEA.emptied(list)`, which every listing wraps its result
in — an empty array is truthy, so this cannot be inferred from the fetch value alone.

Skeletons come from `SEA.states.skeleton(kind, n)` and occupy the same box as the loaded
card, so there is **no layout shift** on swap.

Buttons inside `SEA.states.empty()` / `.error()` dispatch native bubbling events, because
Alpine does not process directives inside `x-html`. Listen on the component root:

```html
<section x-data="…" @sf-reset="reset()" @sf-retry="load()">
```

---

## 8. Accessibility

Target: WCAG 2.2 AA. What is implemented:

- Semantic headings, one `<h1>` per page, no level skips
- `.skip-link` to `#main` on every page, visible on focus
- `:focus-visible` outline is restyled, never removed
- All modals/drawers/lightboxes: `role="dialog"`, `aria-modal`, Escape closes, scroll locked
- Accordions and disclosure buttons carry `aria-expanded`; filter chips carry `aria-pressed`
- Funnel progress uses `aria-current="step"`; completed steps are keyboard-navigable, future steps `disabled`
- The active nav item is marked with `aria-current="page"` in the markup, not by a colour class
- Live regions on result counts, occupancy messages and the toast host (`aria-live="polite"`)
- Every input has a real `<label>`; errors are `role="alert"` + `aria-invalid`
- Icons are `aria-hidden`; icon-only buttons have `aria-label` (translated via `data-i18n-aria`)
- `prefers-reduced-motion: reduce` kills animation, transitions, the hero video and the
  scroll reveal — the reveal is never even armed, so no content depends on it becoming visible
- Nothing depends on colour alone — every badge carries a text label
- No horizontal page overflow at any width; wide tables scroll inside their own container

**Not yet done:** a full screen-reader pass (NVDA/VoiceOver) and a contrast audit of
text over the `.ph-*` gradients once real photography replaces them. Both are QA tasks
for the milestone in `readme.md` §"Recommended order of work" step 5.

---

## 9. Images & performance

### Placeholder → real image

Every image slot is a fixed-ratio box: a `.ph-*` gradient plate, with an
`<img class="img-slot">` already layered over it site-wide. This is wired up now,
not a future step — dropping a real photo in at the right path is the **entire**
remaining task, with **no markup or layout change**:

```html
<div class="relative aspect-[4/3] overflow-hidden rounded-2xl bg-ink">
  <div class="ph ph-reef absolute inset-0">
    <img class="img-slot" src="assets/media/photos/trips/manta-passage.jpg"
         alt="Manta Passage" loading="lazy" onerror="this.style.display='none'">
  </div>
</div>
```

`.img-slot` is absolutely positioned above the plate, so today — with no photography
shot yet — every request 404s, `onerror` hides the broken-image icon, and the `.ph`
plate is all a guest ever sees. Drop a real file in at the exact path and it appears
immediately, no code change.

**Path convention is per content slug, not per `.ph-*` variant** — the same variant
(e.g. `reef`) is reused across many unrelated records, so keying off it would show
identical stock photography on unrelated pages. `assets/js/data.js`'s `photoPath`
object (exposed as `SEA.photoPath`) is the single source of truth for every path:

| Content | Path |
|---|---|
| Trip | `assets/media/photos/trips/<trip.slug>.jpg` |
| Boat | `assets/media/photos/boats/<boat.slug>.jpg` |
| Boat gallery item *n* | `assets/media/photos/boats/<boat.slug>-<n>.jpg` (1-based) |
| Water | `assets/media/photos/waters/<water.slug>.jpg` |
| Article | `assets/media/photos/articles/<article.slug>.jpg` |
| Experience | `assets/media/photos/experiences/<experience.slug>.jpg` |
| Team member | `assets/media/photos/team/<team.slug>.jpg` |
| Cabin | `assets/media/photos/cabins/<boat.slug>-<cabin.code>.jpg` |

The five one-off hero/section photos with no content record to key a slug off
(`404.html`, `charter.html`, `error.html`, `our-story.html` ×2) use a literal, static
path instead — `tools/check-pages.js`'s `INTENTIONALLY_ABSENT` set is what stops the
build from failing on those before the client's photography arrives.

### Asset manifest

| Slot | Ratio | Where | Count needed |
|---|---|---|---|
| Hero video | 16:9 | `index.html` | 1 (+ `hero.mp4`, `hero.webm`, poster exists) |
| Page hero | ~16:9, min-height driven | trip / boat / destination / experience / charter / story | 1 per record |
| Trip card | 4:3 | Discovery grids | 12 |
| Boat card | 3:2 | `boats.html`, comparison table | 4 |
| Destination card | 3:4 (arch) | Waters grids | 8 |
| Article card | 16:10 | Journal grid | 8 |
| Article lead | 16:9 | `article.html` | 8 |
| Cabin | 4:3 | Cabin cards | 4 grades × 4 boats = 16 |
| Boat gallery | 4:3 | `boat.html` | 4 per boat = 16 |
| Trip gallery | 4:3 | `trip.html` | 4 per trip |
| Portrait | 3:4 (arch) | `our-story.html#familia`, author blocks | 6 |

Placeholder variants available: `reef` `deep` `lagoon` `volcano` `sunset` `village`
`jungle` `boat` `cabin` `market` `night` `portrait`.

The hero currently points at a remote stand-in clip on `assets.mixkit.co`. It is the
**only** remote asset left in the build and the only one `tools/check-pages.js` allows;
replacing it with `assets/media/hero.mp4` retires the exception (checklist item 7).

### Fonts & CSS weight

| File | Raw | gzip | Notes |
|---|---|---|---|
| `assets/css/tailwind.css` | 80.5 KB | 13.1 KB | compiled; `npm run css:min` → 60.4 KB / 10.7 KB |
| `assets/css/app.css` | 15.4 KB | 4.8 KB | hand-written |
| `assets/css/fonts.css` | 3.5 KB | 0.7 KB | generated `@font-face` |
| `assets/fonts/*.woff2` | 446 KB | — | 8 files; a Latin-only page loads 3 of them, ≈139 KB |
| `assets/js/vendor/alpine-3.14.9.min.js` | 43.7 KB | — | |

For comparison: the Tailwind Play CDN this replaced was **510 KB of JavaScript** that
compiled the CSS in the browser on every page load.

### Performance notes

- Below-fold images: `loading="lazy" decoding="async"`. Hero: eager, `preload="none"` on the video.
- Aspect ratios are declared in CSS, so CLS stays at zero before images land.
- Skeletons are sized from the loaded card, not from guesses.
- Interactions are Alpine-only — no framework lock-in beyond a 44KB local bundle.
- CSS arrives as CSS. No render-blocking JavaScript compiles the stylesheet, so there is
  no flash of unstyled content and the pages are fully styled with JavaScript disabled.
- The three Latin romans are preloaded; the Latin-Extended and italic faces stay behind
  their `unicode-range` and only download when a page actually needs them.

---

## 10. Currency & language

**Currency** is fully wired. `SEA.CURRENCIES` holds USD, IDR, EUR, AUD, SGD with a rate
and a locale. Anything money-shaped renders as:

```html
<span class="tnum" data-usd="3450">$3,450</span>
```

On a switch, `SEA.hydrate()` rewrites every `[data-usd]` node in place from the integer —
no re-render, no rounding drift. IDR rounds to the nearest 10,000. `layout.js` runs a
debounced `MutationObserver` so cards rendered later by Alpine are formatted too.
`SEA.hydrate()` compares before writing, which is what stops the observer looping.

**Language** covers the global chrome and control labels via `SEA.t()` and
`data-i18n` / `data-i18n-aria` / `data-i18n-placeholder` attributes — around 50 keys,
EN + ID, in `data.js` §1. Page body copy is deliberately **not** in the dictionary: it is
editorial and belongs in the CMS. The switcher is there so long translations can be
pressure-tested in layout (Bahasa Indonesia runs ~15–20% longer than English).

To extend: add the key to both dictionaries, then mark the element with `data-i18n="key"`
and set the English text as the element's initial content.

**One known wrinkle.** The static chrome ships English labels, so a guest who has stored
`lang=id` gets English in the markup and `SEA.hydrate()` swaps it. `layout.js` is a classic
script at the end of `<body>`, so in practice it runs before first paint and nothing is
visible — but the flash is theoretically possible on a very slow parse. If it ever shows,
the fix is to render the initial labels server-side from the session locale, which is what
a backend template would do anyway.

---

## 11. Production checklist

1. ~~**Compile Tailwind.**~~ **Done.** `tailwind.config.js` at the root, `npm run css`,
   Play CDN gone. The content list names `assets/js/data.js` and `layout.js` explicitly
   because the card renderers and the toast are template strings — miss those and the
   classes get purged.
2. ~~**Self-host the fonts.**~~ **Done.** `node tools/vendor.js fonts`, Latin +
   Latin-Extended, `font-display: swap`. Alpine is local too.
3. **Serve the minified CSS.** `npm run css:min` → `assets/css/tailwind.min.css`
   (60.4 KB / 10.7 KB gzip) and point `partials/assets.html` at it, then re-sync. The
   deliverable ships the unminified build on purpose so it can be read and diffed.
4. **Turn `partials/` into backend includes.** `assets.html`, `header.html`, `footer.html`
   and `help.html` are already whole, valid fragments — they become `header.blade.php` and
   friends almost verbatim. Two things the template should take over from
   `tools/sync-partials.js`: setting `aria-current="page"` on the active nav item, and
   omitting the help button on funnel routes. Once the backend owns them,
   `sync-partials.js` and the marker comments retire.
5. **Replace the four stand-ins** in §6 with real requests. Keep the promise shape and the
   `loading → ready | empty | error` contract.
6. **Move reference generation server-side.**
7. **Wire the server error pages** to `404.html` / `error.html`.
8. **Add `assets/media/hero.mp4` + `.webm`**, ≤ 6MB, muted, ~12s loop, and drop the remote
   stand-in `<source>` on `index.html`. That is the last third-party fetch in the build;
   the SVG poster already carries the hero if the files are absent.
9. **Refresh FX rates** on a schedule; keep the "invoice is issued in the currency you
   choose at checkout" promise in `policies.html#terms` true.
10. **Real per-date cabin inventory** — see the open item under Departure in §5.
11. Set `robots`/`sitemap`; `reserve.html`, `components.html`, `404.html`, `error.html`
    are already `noindex`.
12. **Add an italic Inter face** if editorial copy will use `<em>` in body text. The font
    request mirrors what the design was approved against — italic for Fraunces only — so
    `<em>` in Inter is currently synthesised by the browser. Add `ital` to the Inter family
    in `tools/vendor.js` and re-run it.

### Two decisions worth knowing

- **Tailwind stays on v3.4.19 (LTS), deliberately.** It is the same engine the Play CDN
  ran, so compiling changed no class semantics and needed no visual re-approval. Moving to
  v4 is a separate migration: `rounded` (×12) and `backdrop-blur` (×9) were renamed, the
  default `ring` width went 3px → 1px, the default border colour changed, the `space-y-*`
  selector changed, and the callback-style `typography` config here has no v4 equivalent.
- **`node_modules/` is not part of the deliverable.** Ship `package.json`,
  `tailwind.config.js` and the compiled CSS. A machine with no npm can use the standalone
  `tailwindcss` v3.4.19 executable, which has forms and typography built in.

---

## 12. Deliberately not built

Named so they are decisions rather than gaps:

- **Multi-cabin bookings.** One cabin per reservation. Larger parties are pushed to
  charter or to the office by an explicit message at step 4. Extending means turning
  `cabin` into `cabins[]` and summing per-cabin occupancy.
- **Real authentication.** The sign-in modal validates and shows its success state; there
  is no session. Partner login in `partners.html` points at the same modal.
- **Payment capture.** By design — the flow ends at a held cabin with a payment link to
  follow. This matches the policy copy and keeps PCI scope out of the frontend.
- **A live availability socket.** Availability is read once per page load.
- **Full-page i18n.** See §10.

---

## 13. QA scripts

```bash
npm run qa                          # all four, in order
```

or individually:

```bash
node tools/sync-partials.js --check # chrome + <head> match partials/
node tools/check-pages.js           # every page, structurally (calls the drift check)
node tools/check-data.js            # content model + renderers
node tools/check-css.js             # is the compiled CSS current?
```

The first three read source files only — no dependencies, so they run on a bare checkout
and drop straight into CI. `check-css.js` needs `node_modules`; without it, it says so and
exits 0 rather than failing a clean deliverable.

- **`tools/check-data.js`** — runs every formatter across 5 currencies × 2 languages, every
  card renderer against every record, checks referential integrity (trip → water/boat/
  experience, departure → trip/boat), asserts every lookup returns `null` for an unknown
  slug, and greps the rendered HTML for `undefined` / `NaN` / `null` / `[object`.
- **`tools/check-pages.js`** — parses every inline `<script>`, resolves every literal
  internal link, checks every `.ph-*` and custom class is defined, confirms every
  `x-data="fn()"` resolves, confirms every `SEA.*` member used in markup exists, asserts
  the page contract (three marker blocks, no leftover injection hosts, `layout.js` last),
  checks tag balance across 16 element types, verifies **no page loads a remote asset** and
  that **`tailwind.css` precedes `app.css`**, and calls `require('./sync-partials.js').check()`
  so a hand-edited block fails the run.
- **`tools/check-css.js`** — rebuilds the CSS into a temp file and compares it byte-for-byte
  with the committed `assets/css/tailwind.css`. This is the guard for the one failure mode
  compiling introduced: add a class, forget `npm run css`, and it silently has no rule.

Since the chrome and the `<head>` became static markup, these checks cover them too — tag
balance, link resolution and asset origins across the header, footer and head were
previously invisible to QA because that markup lived inside JS strings.

Current status: **23 pages, 0 problems, CSS current.** Two expected notes —
`hero.webm` absent by design, and `404.html` / `components.html` unlinked from the chrome
by design (the first is served by the web server on unknown routes, the second is
internal).

Worth re-running after any content change; all four are cheap and catch the class of bug
that only shows up on one record.
