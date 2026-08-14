/* Sea Familia — content model smoke test.
   Runs every SEA formatter across 5 currencies x 2 languages, every card renderer
   against every record, checks referential integrity, and asserts that nothing
   leaks "undefined" / "NaN" / "null" / "[object" into rendered HTML.

   Usage:  node tools/check-data.js        (exit 0 = clean)
*/
const fs = require('fs');
const nodePath = require('path');
const path = nodePath.resolve(__dirname, '..', 'assets/js/data.js');

global.window = {};
global.localStorage = { _m: {}, getItem(k) { return this._m[k] ?? null; }, setItem(k, v) { this._m[k] = v; } };
global.performance = { now: () => 1234.5 };
global.document = { querySelectorAll: () => [] };

eval(fs.readFileSync(path, 'utf8'));
const SEA = global.window.SEA;

let fails = 0;
const bad = /undefined|NaN|null|\[object/;
function check(label, html) {
  if (typeof html !== 'string') { console.log('FAIL (not a string):', label); fails++; return; }
  if (bad.test(html)) {
    console.log('FAIL (leaky value):', label, '→', html.match(bad)[0]);
    console.log('   ', html.slice(Math.max(0, html.search(bad) - 90), html.search(bad) + 60).replace(/\s+/g, ' '));
    fails++;
  }
}

// --- referential integrity across the content model -------------------------
SEA.trips.forEach(t => {
  if (!SEA.water(t.water)) { console.log('FAIL: trip', t.slug, '→ unknown water', t.water); fails++; }
  if (!SEA.boat(t.boat)) { console.log('FAIL: trip', t.slug, '→ unknown boat', t.boat); fails++; }
  t.experiences.forEach(e => { if (!SEA.experience(e)) { console.log('FAIL: trip', t.slug, '→ unknown experience', e); fails++; } });
  if (!SEA.routeFor(t).length) { console.log('FAIL: trip', t.slug, '→ empty route'); fails++; }
});
SEA.departures.forEach(d => {
  if (!SEA.trip(d.trip)) { console.log('FAIL: departure', d.id, '→ unknown trip', d.trip); fails++; }
  if (!SEA.boat(d.boat)) { console.log('FAIL: departure', d.id, '→ unknown boat', d.boat); fails++; }
  const tr = SEA.trip(d.trip);
  if (tr && tr.boat !== d.boat) console.log('note: departure', d.id, 'boat differs from trip default');
  if (tr && tr.nights !== d.nights) console.log('note: departure', d.id, 'nights differ from trip');
});
SEA.waters.forEach(w => {
  if (!SEA.tripsInWater(w.slug).length) { console.log('FAIL: water', w.slug, '→ no trips'); fails++; }
  w.bestFor.forEach(e => { if (!SEA.experience(e)) { console.log('FAIL: water', w.slug, '→ unknown experience', e); fails++; } });
});
SEA.boats.forEach(b => {
  if (!SEA.tripsOnBoat(b.slug).length) { console.log('FAIL: boat', b.slug, '→ no trips'); fails++; }
  if (b.cabinTypes.length < 3) { console.log('FAIL: boat', b.slug, '→ too few cabin types'); fails++; }
});

// --- formatters, in every currency + language ------------------------------
['USD', 'IDR', 'EUR', 'AUD', 'SGD'].forEach(c => {
  ['en', 'id'].forEach(l => {
    SEA.store.currency = c; SEA.store.lang = l;
    check(`money ${c}/${l}`, SEA.fmt.money(3450));
    check(`money null ${c}/${l}`, SEA.fmt.money(null));
    check(`money junk ${c}/${l}`, SEA.fmt.money('abc'));
    check(`dateRange ${c}/${l}`, SEA.fmt.dateRange('2026-09-24', 12));
    check(`dateRange same-month ${c}/${l}`, SEA.fmt.dateRange('2026-09-06', 10));
    check(`date ${c}/${l}`, SEA.fmt.date('2026-12-04'));
    check(`date bad ${c}/${l}`, SEA.fmt.date('not-a-date'));
    check(`nights ${c}/${l}`, SEA.fmt.nights(7));
    check(`guests ${c}/${l}`, SEA.fmt.guests(2));
    check(`monthLabel ${c}/${l}`, SEA.fmt.monthLabel('2027-01-01'));
  });
});
SEA.store.currency = 'USD'; SEA.store.lang = 'en';
if (!/^SF-[A-Z0-9]{6}$/.test(SEA.fmt.reference(99))) { console.log('FAIL: reference format', SEA.fmt.reference(99)); fails++; }

// --- every renderer against every record ----------------------------------
SEA.trips.forEach(t => check('cards.trip ' + t.slug, SEA.cards.trip(t)));
SEA.departures.forEach(d => check('cards.departure ' + d.id, SEA.cards.departure(d)));
SEA.boats.forEach(b => {
  check('cards.boat ' + b.slug, SEA.cards.boat(b));
  b.cabinTypes.forEach(c => check('cards.cabin ' + b.slug + '/' + c.code, SEA.cards.cabin(c, { boatSlug: b.slug })));
});
SEA.waters.forEach(w => check('cards.water ' + w.slug, SEA.cards.water(w)));
SEA.articles.forEach(a => {
  check('cards.article ' + a.slug, SEA.cards.article(a));
  if (!SEA.bodyFor(a).length) { console.log('FAIL: article', a.slug, '→ empty body'); fails++; }
});
SEA.experiences.forEach(e => check('cards.experience ' + e.slug, SEA.cards.experience(e)));
['open', 'limited', 'waitlist', 'closed'].forEach(s => check('badge ' + s, SEA.badge(s)));
check('badge unknown enum', SEA.badge('something-new'));
['trip', 'departure', 'boat', 'water', 'article', 'cabin', 'nonsense'].forEach(k =>
  check('skeleton ' + k, SEA.states.skeleton(k, 2)));
check('empty', SEA.states.empty({ onReset: true }));
check('empty bare', SEA.states.empty({}));
check('error', SEA.states.error({ onRetry: true }));
check('error bare', SEA.states.error({}));
check('metaRow with holes', SEA.metaRow(['a', null, undefined, 'b']));

// --- missing-record resilience (deep-link to a deleted slug) ---------------
['water', 'boat', 'trip', 'experience', 'article', 'departure'].forEach(fn => {
  if (SEA[fn]('does-not-exist') !== null) { console.log('FAIL: lookup', fn, 'should return null'); fails++; }
});

// --- filters --------------------------------------------------------------
const all = SEA.filterTrips({});
if (all.length !== SEA.trips.length) { console.log('FAIL: empty filter should pass everything'); fails++; }
if (SEA.filterTrips({ water: 'komodo', length: 'long' }).length !== 0) console.log('note: komodo+long is non-empty');
if (!SEA.filterTrips({ q: 'manta' }).length) { console.log('FAIL: text search "manta"'); fails++; }
if (SEA.filterTrips({ water: 'nope' }).length !== 0) { console.log('FAIL: unknown water should be empty'); fails++; }
SEA.parties.forEach(p => {
  if (!SEA.filterTrips({ party: p.slug }).length) { console.log('FAIL: no trips for party', p.slug); fails++; }
});
SEA.lengths.forEach(l => {
  if (!SEA.filterTrips({ length: l.slug }).length) { console.log('FAIL: no trips for length', l.slug); fails++; }
});
SEA.experiences.forEach(e => {
  if (!SEA.filterTrips({ experience: e.slug }).length) { console.log('FAIL: no trips for experience', e.slug); fails++; }
});
const months = SEA.departureMonths();
if (!months.length) { console.log('FAIL: no departure months'); fails++; }
months.forEach(m => check('month ' + m.value, m.label));
if (!SEA.filterDepartures({ available: true }).length) { console.log('FAIL: no available departures'); fails++; }
if (!SEA.search('komodo').total) { console.log('FAIL: search komodo'); fails++; }
if (SEA.search('z').total !== 0) { console.log('FAIL: 1-char search should be empty'); fails++; }
if (SEA.search('qqqqzzz').total !== 0) { console.log('FAIL: nonsense search should be empty'); fails++; }

// --- href builder ---------------------------------------------------------
if (SEA.href('trip.html', { slug: 'x', empty: '', nul: null }) !== 'trip.html?slug=x') {
  console.log('FAIL: href drops empty params →', SEA.href('trip.html', { slug: 'x', empty: '', nul: null })); fails++;
}
if (SEA.href('a.html', {}) !== 'a.html') { console.log('FAIL: href with no params'); fails++; }

// --- every trip must have at least one bookable departure or be flagged ---
const orphans = SEA.trips.filter(t => SEA.departuresFor(t.slug).length === 0).map(t => t.slug);
if (orphans.length) console.log('note: trips with no open departure →', orphans.join(', '));

console.log(fails === 0 ? '\n✓ all checks passed' : `\n✗ ${fails} failure(s)`);
process.exit(fails === 0 ? 0 : 1);
