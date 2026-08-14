/* ============================================================================
   Sea Familia — shared data + presentation layer
   ----------------------------------------------------------------------------
   This file is the seam between design and backend. Everything a screen renders
   comes from here, so Pak Juma's team can replace the arrays with API responses
   without touching markup.

     SEA.experiences / waters / boats / trips / departures / articles / team / faq
     SEA.fmt.*      formatting (money, dates, durations) — locale + currency aware
     SEA.cards.*    HTML string renderers for every discovery/commerce card
     SEA.states.*   skeleton / empty / error blocks
     SEA.query()    read filters + forced states from the URL
     SEA.hydrate()  re-format [data-usd] prices and [data-i18n] labels in place

   Field contracts (required vs optional, fallbacks, enums) are documented in
   docs/HANDOFF.md — keep the two in sync.

   Money: every price in this file is USD per person, integer, tax inclusive.
   ========================================================================== */
window.SEA = (function () {
  'use strict';

  /* ==========================================================================
     1. Locale + currency utilities
     ======================================================================== */
  const CURRENCIES = {
    USD: { code: 'USD', symbol: '$', rate: 1, decimals: 0, locale: 'en-US' },
    IDR: { code: 'IDR', symbol: 'Rp', rate: 16250, decimals: 0, locale: 'id-ID' },
    EUR: { code: 'EUR', symbol: '€', rate: 0.92, decimals: 0, locale: 'de-DE' },
    AUD: { code: 'AUD', symbol: 'A$', rate: 1.52, decimals: 0, locale: 'en-AU' },
    SGD: { code: 'SGD', symbol: 'S$', rate: 1.34, decimals: 0, locale: 'en-SG' },
  };

  const store = {
    get currency() {
      try { return localStorage.getItem('sf.currency') || 'USD'; } catch (e) { return 'USD'; }
    },
    set currency(v) {
      try { localStorage.setItem('sf.currency', v); } catch (e) {}
    },
    get lang() {
      try { return localStorage.getItem('sf.lang') || 'en'; } catch (e) { return 'en'; }
    },
    set lang(v) {
      try { localStorage.setItem('sf.lang', v); } catch (e) {}
    },
  };

  /* Global UI copy. Page body copy stays in the markup / CMS — this dictionary
     covers navigation, controls and system messages so long translations can be
     pressure-tested in layout. Coverage is listed in docs/HANDOFF.md. */
  const I18N = {
    en: {
      'nav.experiences': 'Experiences', 'nav.destinations': 'Destinations',
      'nav.boats': 'Boats', 'nav.departures': 'Departures',
      'nav.story': 'Our Story', 'nav.journal': 'Journal',
      'nav.search': 'Search', 'nav.signin': 'Sign in', 'nav.menu': 'Menu',
      'nav.close': 'Close', 'nav.home': 'Home',
      'cta.reserve': 'Reserve a cabin', 'cta.explore': 'Explore',
      'cta.viewtrip': 'View itinerary', 'cta.charter': 'Request a charter',
      'cta.back': 'Back', 'cta.continue': 'Continue', 'cta.retry': 'Try again',
      'cta.viewall': 'View all', 'cta.help': 'Talk to the familia',
      'cta.select': 'Select cabin', 'cta.soldout': 'Sold out',
      'cta.waitlist': 'Join waitlist', 'cta.details': 'Package details',
      'lbl.from': 'From', 'lbl.pp': 'per person', 'lbl.nights': 'nights',
      'lbl.night': 'night', 'lbl.guests': 'Guests', 'lbl.guest': 'Guest',
      'lbl.cabin': 'Cabin', 'lbl.boat': 'Boat', 'lbl.depart': 'Departs',
      'lbl.summary': 'Your voyage', 'lbl.total': 'Total', 'lbl.deposit': 'Deposit today',
      'lbl.currency': 'Currency', 'lbl.language': 'Language',
      'lbl.sharing': 'Sharing trip',
      'st.open': 'Cabins available', 'st.limited': 'Almost full',
      'st.waitlist': 'Waitlist', 'st.closed': 'Closed',
      'note.fullybooked': 'Fully booked', 'note.waitlistopen': 'Fully booked — waitlist open',
      'note.cabin_singular': 'cabin left on this date', 'note.cabin_plural': 'cabins left on this date',
      'sys.loading': 'Loading', 'sys.empty': 'Nothing here yet',
      'sys.error': "We couldn't load this",
    },
    id: {
      'nav.experiences': 'Pengalaman', 'nav.destinations': 'Destinasi',
      'nav.boats': 'Kapal', 'nav.departures': 'Jadwal',
      'nav.story': 'Cerita Kami', 'nav.journal': 'Jurnal',
      'nav.search': 'Cari', 'nav.signin': 'Masuk', 'nav.menu': 'Menu',
      'nav.close': 'Tutup', 'nav.home': 'Beranda',
      'cta.reserve': 'Pesan kabin', 'cta.explore': 'Jelajahi',
      'cta.viewtrip': 'Lihat itinerary', 'cta.charter': 'Ajukan charter',
      'cta.back': 'Kembali', 'cta.continue': 'Lanjut', 'cta.retry': 'Coba lagi',
      'cta.viewall': 'Lihat semua', 'cta.help': 'Hubungi kami',
      'cta.select': 'Pilih kabin', 'cta.soldout': 'Habis terjual',
      'cta.waitlist': 'Gabung daftar tunggu', 'cta.details': 'Detail paket',
      'lbl.from': 'Mulai', 'lbl.pp': 'per orang', 'lbl.nights': 'malam',
      'lbl.night': 'malam', 'lbl.guests': 'Tamu', 'lbl.guest': 'Tamu',
      'lbl.cabin': 'Kabin', 'lbl.boat': 'Kapal', 'lbl.depart': 'Berlayar',
      'lbl.summary': 'Perjalanan Anda', 'lbl.total': 'Total', 'lbl.deposit': 'Bayar sekarang',
      'lbl.currency': 'Mata uang', 'lbl.language': 'Bahasa',
      'lbl.sharing': 'Trip berbagi',
      'st.open': 'Kabin tersedia', 'st.limited': 'Hampir penuh',
      'st.waitlist': 'Daftar tunggu', 'st.closed': 'Ditutup',
      'note.fullybooked': 'Sudah penuh', 'note.waitlistopen': 'Sudah penuh — daftar tunggu dibuka',
      'note.cabin_singular': 'kabin tersisa untuk tanggal ini', 'note.cabin_plural': 'kabin tersisa untuk tanggal ini',
      'sys.loading': 'Memuat', 'sys.empty': 'Belum ada apa pun di sini',
      'sys.error': 'Kami gagal memuat bagian ini',
    },
  };

  function t(key) {
    const dict = I18N[store.lang] || I18N.en;
    return dict[key] || I18N.en[key] || key;
  }

  /* --- formatting ---------------------------------------------------------
     Every formatter has a fallback so a missing/null API value never renders
     as "undefined", "NaN" or "null" (brief §Design the states that get missed).
     ---------------------------------------------------------------------- */
  const MONTHS = {
    en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    id: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
  };
  const MONTHS_LONG = {
    en: ['January', 'February', 'March', 'April', 'May', 'June', 'July',
      'August', 'September', 'October', 'November', 'December'],
    id: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli',
      'Agustus', 'September', 'Oktober', 'November', 'Desember'],
  };

  const fmt = {
    /** Price in the guest's chosen currency. null/undefined → "On request". */
    money(usd, opts) {
      const o = opts || {};
      if (usd === null || usd === undefined || usd === '' || isNaN(Number(usd))) {
        return o.fallback || (store.lang === 'id' ? 'Atas permintaan' : 'On request');
      }
      const c = CURRENCIES[store.currency] || CURRENCIES.USD;
      let v = Number(usd) * c.rate;
      // Indonesian rupiah reads better rounded to the nearest 10k
      if (c.code === 'IDR') v = Math.round(v / 10000) * 10000;
      try {
        return new Intl.NumberFormat(c.locale, {
          style: 'currency', currency: c.code,
          minimumFractionDigits: c.decimals, maximumFractionDigits: c.decimals,
        }).format(v);
      } catch (e) {
        return c.symbol + Math.round(v).toLocaleString();
      }
    },

    /** Price wrapped so a currency switch can rewrite it in place. */
    priceTag(usd, cls) {
      const safe = (usd === null || usd === undefined || isNaN(Number(usd))) ? '' : Number(usd);
      return '<span class="tnum ' + (cls || '') + '" data-usd="' + safe + '">' +
        fmt.money(usd) + '</span>';
    },

    date(iso, opts) {
      const o = opts || {};
      const d = parseISO(iso);
      if (!d) return o.fallback || '—';
      const l = store.lang === 'id' ? 'id' : 'en';
      const m = o.long ? MONTHS_LONG[l][d.getMonth()] : MONTHS[l][d.getMonth()];
      return l === 'id'
        ? d.getDate() + ' ' + m + ' ' + d.getFullYear()
        : m + ' ' + d.getDate() + ', ' + d.getFullYear();
    },

    /** "Sep 12 – 19, 2026" / "12 – 19 Sep 2026" — collapses shared month+year. */
    dateRange(iso, nights) {
      const a = parseISO(iso);
      if (!a) return '—';
      const b = new Date(a.getTime());
      b.setDate(b.getDate() + (Number(nights) || 0));
      const l = store.lang === 'id' ? 'id' : 'en';
      const ma = MONTHS[l][a.getMonth()], mb = MONTHS[l][b.getMonth()];
      const sameMonth = a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
      if (l === 'id') {
        return sameMonth
          ? a.getDate() + '–' + b.getDate() + ' ' + ma + ' ' + b.getFullYear()
          : a.getDate() + ' ' + ma + ' – ' + b.getDate() + ' ' + mb + ' ' + b.getFullYear();
      }
      return sameMonth
        ? ma + ' ' + a.getDate() + '–' + b.getDate() + ', ' + b.getFullYear()
        : ma + ' ' + a.getDate() + ' – ' + mb + ' ' + b.getDate() + ', ' + b.getFullYear();
    },

    monthLabel(iso) {
      const d = parseISO(iso);
      if (!d) return '—';
      const l = store.lang === 'id' ? 'id' : 'en';
      return MONTHS_LONG[l][d.getMonth()] + ' ' + d.getFullYear();
    },

    nights(n) {
      if (!n && n !== 0) return '—';
      return n + ' ' + (n === 1 ? t('lbl.night') : t('lbl.nights'));
    },

    /** Human duration, never "Pax"-style jargon. */
    guests(n) {
      if (!n) return '—';
      return n + ' ' + (n === 1 ? t('lbl.guest').toLowerCase() : t('lbl.guests').toLowerCase());
    },

    /** Booking reference: SF-26A7K4 — deterministic length, safe to read aloud. */
    reference(seed) {
      const alphabet = 'ACDEFGHJKLMNPQRTUVWXY3479';
      let n = Math.abs(Math.floor(seed || (performance.now() * 1000)));
      let out = '';
      for (let i = 0; i < 6; i++) {
        out += alphabet[n % alphabet.length];
        n = Math.floor(n / alphabet.length) + (i + 7) * 13;
      }
      return 'SF-' + out;
    },
  };

  function parseISO(iso) {
    if (!iso || typeof iso !== 'string') return null;
    const p = iso.split('-');
    if (p.length !== 3) return null;
    const d = new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
    return isNaN(d.getTime()) ? null : d;
  }
  function addDays(iso, n) {
    const d = parseISO(iso);
    if (!d) return null;
    d.setDate(d.getDate() + n);
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') +
      '-' + String(d.getDate()).padStart(2, '0');
  }

  /* ==========================================================================
     2. Content — Experiences
     ======================================================================== */
  const experiences = [
    {
      slug: 'diving', name: 'Diving & Reefs', ph: 'reef',
      tagline: 'Reefs that still surprise the crew',
      blurb: 'Three to four dives a day on walls, seamounts and coral gardens, led by guides who grew up on these reefs. Nitrox on board, small groups in the water, and no rushing back to the boat.',
      forWho: ['Certified divers', 'Confident snorkellers', 'Anyone working on a course'],
      signature: ['Manta cleaning stations at dawn', 'Two dedicated tenders, never a queue', 'Free nitrox for certified guests'],
    },
    {
      slug: 'family', name: 'Family Voyages', ph: 'lagoon',
      tagline: 'Shallow water, long days, early dinners',
      blurb: 'Routes built around calm anchorages and short crossings, with a crew who genuinely likes children. Snorkel lessons, kayaks, night-time plankton hunts and a kitchen that will make plain rice without a sigh.',
      forWho: ['Families with children 4+', 'Multi-generation groups', 'First-time sailors'],
      signature: ['Two interconnecting cabin pairs', 'Crew-led reef school for kids', 'Flexible meal times'],
    },
    {
      slug: 'remote', name: 'Remote Passages', ph: 'deep',
      tagline: 'Long crossings, few other boats',
      blurb: 'Overnight sails between island groups where the chart still has blank patches. Ten to fourteen nights, a rhythm set by weather rather than schedule, and anchorages we sometimes name ourselves.',
      forWho: ['Experienced travellers', 'Divers chasing untouched sites', 'Sailors who like a night watch'],
      signature: ['Open-ended anchorage plans', 'Night watches you can join', 'Provisioning for two weeks out'],
    },
    {
      slug: 'culture', name: 'Culture & Craft', ph: 'village',
      tagline: 'Ikat looms, spice gardens, boat builders',
      blurb: 'Village visits arranged by people who are related to half the village. Weaving on Solor, nutmeg drying in Banda, phinisi hulls taking shape in Bira — all on the villages’ terms, never as a photo stop.',
      forWho: ['Slow travellers', 'Textile and craft people', 'Anyone tired of resorts'],
      signature: ['Loom sessions with Solor weavers', 'Spice-garden walk in Banda Neira', 'Boatyard visit in Bira'],
    },
    {
      slug: 'wellness', name: 'Slow Sailing & Wellness', ph: 'boat',
      tagline: 'Sail more, motor less',
      blurb: 'Fewer stops, longer sails, and mornings that start with a mat on the foredeck. Massage on the shaded aft deck, a kitchen leaning on what the market had, and permission to do absolutely nothing.',
      forWho: ['Couples', 'Solo travellers', 'Anyone off a hard year'],
      signature: ['Daily foredeck yoga', 'Two therapists in the crew', 'Sails up whenever the wind allows'],
    },
    {
      slug: 'light', name: 'Photography & Light', ph: 'sunset',
      tagline: 'Anchorages chosen for the hour, not the map',
      blurb: 'Itineraries planned backwards from the light. Blue-hour departures, tender drop-offs on the right side of a ridge, a dry camera room with charging benches, and a crew that will happily wait ten more minutes.',
      forWho: ['Photographers and filmmakers', 'Drone pilots', 'Patient early risers'],
      signature: ['Golden-hour anchorage planning', 'Dry camera room + charging bench', 'Tender available at 4:45am'],
    },
  ];

  /* ==========================================================================
     3. Content — Waters (destinations)
     ======================================================================== */
  const waters = [
    {
      slug: 'komodo', name: 'Komodo & the Flores Sea', short: 'Komodo', ph: 'lagoon',
      gateway: 'Labuan Bajo', season: 'April – November', crossing: 'Short hops, calm nights',
      blurb: 'Pink beaches, hard-coral ridges and current-fed cleaning stations, all within a few hours of each other.',
      story: 'The Flores Sea funnels cold water between islands twice a day, and everything here is organised around that. Reefs sit on the corners where the current bites; the mantas queue where it slows. Because nothing is far from anything, Komodo is where we send people who want a full week without a single long crossing — and where we take our own families.',
      highlights: ['Manta cleaning stations at Karang Makassar', 'Hard-coral ridge at Batu Bolong', 'Rangers’ walk on Rinca at first light'],
      stops: ['Labuan Bajo', 'Sebayur', 'Batu Bolong', 'Karang Makassar', 'Padar', 'Pink Beach', 'Rinca', 'Siaba Bay', 'Sabolan'],
      bestFor: ['diving', 'family', 'wellness'],
    },
    {
      slug: 'raja-ampat', name: 'Raja Ampat', short: 'Raja Ampat', ph: 'reef',
      gateway: 'Sorong', season: 'October – April', crossing: 'Overnight between kingdoms',
      blurb: 'The richest reef fish count on the planet, spread across four island kingdoms and a thousand limestone islets.',
      story: 'Fifteen hundred islands, and the reef holds more fish species per hectare than anywhere surveyed. Misool in the south is quiet, karst-walled and best for wide angle; Dampier Strait in the middle runs fast and busy with mantas; the north, off Waigeo, is where the water goes glassy and the birds start calling before five. Ten nights is the minimum to see two of the three properly.',
      highlights: ['Misool’s karst lagoons at dawn', 'Manta highway through Dampier Strait', 'Wayag viewpoint before the heat'],
      stops: ['Sorong', 'Kri', 'Dampier Strait', 'Yangeffo', 'Misool', 'Boo Windows', 'Fiabacet', 'Wayag', 'Aljui Bay'],
      bestFor: ['diving', 'remote', 'light'],
    },
    {
      slug: 'banda', name: 'The Banda Sea', short: 'Banda Sea', ph: 'volcano',
      gateway: 'Ambon or Saumlaki', season: 'March – April, September – October',
      crossing: 'Real open-water passages',
      blurb: 'Volcano walls, hammerhead season and the nutmeg islands that once redrew the map of Europe.',
      story: 'This is the crossing our crew talks about in the off season. Deep blue water, seamounts that rise out of nowhere, and the lava flow off Gunung Api where hard coral colonised bare rock after 1988 and now runs unbroken to forty metres. Banda Neira itself is a small Dutch colonial town gone quietly to seed, and the nutmeg trees are still there behind the fort.',
      highlights: ['The 1988 lava flow, now solid coral', 'Hammerheads at Nil Desperandum in season', 'Nutmeg gardens behind Fort Belgica'],
      stops: ['Ambon', 'Nusa Laut', 'Koon', 'Banda Neira', 'Gunung Api', 'Hatta', 'Manuk', 'Nil Desperandum', 'Serua'],
      bestFor: ['remote', 'diving', 'culture'],
    },
    {
      slug: 'alor', name: 'Alor & Solor', short: 'Alor & Solor', ph: 'village',
      gateway: 'Maumere to Kupang', season: 'May – October', crossing: 'Straits and tide gates',
      blurb: 'Cold upwellings, black-sand slopes and the ikat weaving villages of the Solor archipelago.',
      story: 'The straits here squeeze cold water up from the deep, which means muck diving with things you will not find further west, and reef fish behaving strangely well. Above water it is the weaving: Solor and Lembata still spin, dye and tie by hand, and the patterns tell you which village a cloth came from. We arrive with the family we always arrive with.',
      highlights: ['Ikat looms in Lamalera and Solor', 'Cold-water muck slopes off Alor', 'Whale-bone chapel on Lembata'],
      stops: ['Maumere', 'Adonara', 'Solor', 'Lembata', 'Pantar', 'Kalabahi', 'Alor Kecil', 'Kupang'],
      bestFor: ['culture', 'diving', 'remote'],
    },
    {
      slug: 'triton', name: 'Triton Bay', short: 'Triton Bay', ph: 'jungle',
      gateway: 'Kaimana', season: 'November – April', crossing: 'Sheltered, jungle-edged',
      blurb: 'Soft coral in colours that look edited, whale sharks over fishing platforms, and almost no other boats.',
      story: 'Nutrient-heavy green water and no swell means soft coral grows here like nowhere else — full walls of it, in oranges and pinks that photograph as if the saturation slider slipped. The bagan fishing platforms attract whale sharks that have learned people mean small fish. Visibility is not the point in Triton Bay. Density is.',
      highlights: ['Soft-coral walls at Little Komodo', 'Whale sharks under the bagans', 'Rock paintings on the karst cliffs'],
      stops: ['Kaimana', 'Triton Bay', 'Aiduma', 'Little Komodo', 'Bo’o', 'Namatota', 'Iris Strait'],
      bestFor: ['diving', 'light', 'remote'],
    },
    {
      slug: 'wakatobi', name: 'Wakatobi & the Tukang Besi', short: 'Wakatobi', ph: 'reef',
      gateway: 'Wangi-Wangi', season: 'March – December', crossing: 'Atoll to atoll',
      blurb: 'Four atolls, wall diving that starts a metre from the tender, and Bajo stilt villages on the horizon.',
      story: 'The Tukang Besi chain is essentially one long drop-off, and the reef top is so healthy you can spend an entire dive in five metres of water and never look down. The Bajo communities on Kaledupa live over water on stilts and have done for generations; we visit with the school, not the camera, first.',
      highlights: ['Wall diving straight off the reef top', 'Bajo stilt village on Kaledupa', 'Night dives on Hoga’s slope'],
      stops: ['Wangi-Wangi', 'Hoga', 'Kaledupa', 'Tomia', 'Binongko', 'Runduma'],
      bestFor: ['diving', 'wellness', 'culture'],
    },
    {
      slug: 'cenderawasih', name: 'Cenderawasih Bay', short: 'Cenderawasih', ph: 'deep',
      gateway: 'Nabire or Manokwari', season: 'May – October', crossing: 'Long, flat, remote',
      blurb: 'The one place where whale sharks are residents rather than visitors, and the reef has evolved alone.',
      story: 'Cenderawasih has been geologically semi-isolated long enough to grow its own endemic species, and the whale sharks that gather under the bagans do not migrate — they live here. That is why guests get hours rather than minutes with them. The bay is enormous, the crossings are long, and there is essentially no other traffic.',
      highlights: ['Resident whale sharks, hours not minutes', 'WWII wrecks in shallow water', 'Endemic reef fish found nowhere else'],
      stops: ['Nabire', 'Kwatisore', 'Roon', 'Mioswaar', 'Rumberpon', 'Manokwari'],
      bestFor: ['diving', 'family', 'remote'],
    },
    {
      slug: 'halmahera', name: 'Halmahera & Ternate', short: 'Halmahera', ph: 'market',
      gateway: 'Ternate', season: 'March – May, September – November', crossing: 'Volcanic island chain',
      blurb: 'The original spice islands: clove-covered volcanoes, sultans’ forts and reefs nobody has named yet.',
      story: 'Ternate and Tidore are two perfect volcanic cones facing each other across a strait, and for two centuries the entire European clove supply came from their slopes. The diving off Halmahera is genuinely under-surveyed — we have named three sites ourselves and are not sure about a fourth. Bring curiosity rather than a checklist.',
      highlights: ['Clove terraces on Tidore', 'Sultan’s fort and archive in Ternate', 'Unsurveyed reef along west Halmahera'],
      stops: ['Ternate', 'Tidore', 'Makian', 'Widi Islands', 'Guraici', 'Bacan', 'Kayoa'],
      bestFor: ['culture', 'remote', 'light'],
    },
  ];

  /* ==========================================================================
     4. Content — Boats + cabin types
     ======================================================================== */
  const boats = [
    {
      slug: 'familia-satu', name: 'Familia Satu', type: 'Traditional phinisi', ph: 'boat',
      tagline: 'The first boat. Still the one the family sails on.',
      blurb: 'Built in Bira in 2016 by the Konjo shipwrights our grandfather worked beside, and refitted in 2023 without losing a single beam of the original ironwood. Familia Satu carries sixteen guests and fourteen crew, which is the ratio the whole company is built around.',
      length: '32 m', beam: '8.4 m', built: 2016, refit: 2023,
      cabins: 8, guests: 16, crew: 14, cruise: '9 knots', tenders: 2,
      decks: 3, sails: 'Gaff-rigged ketch, 7 sails', charterDay: 6800,
      facilities: ['Shaded main-deck lounge', 'Sun deck with daybeds', 'Dive deck with two tenders',
        'Nitrox membrane', 'Freshwater deck showers', 'Massage corner aft',
        'Chart table and library', 'Camera room with charging bench', 'Starlink and hot water throughout'],
      safety: ['Oxygen and first-response kit on both decks', 'DAN-affiliated evacuation cover',
        'Two liferafts, EPIRB and satellite phone', 'Crew drilled monthly'],
      gallery: ['boat', 'cabin', 'reef', 'sunset'],
      cabinTypes: [
        { code: 'OM', name: 'Ocean Master', deck: 'Main deck', beds: 'King', occupancy: 2, maxOccupancy: 3, price: 4150, left: 1, ph: 'cabin', features: ['Sea-level windows', 'Ensuite with tub', 'Writing desk', '18 m²'] },
        { code: 'UD', name: 'Upper Deck Double', deck: 'Upper deck', beds: 'Queen', occupancy: 2, maxOccupancy: 2, price: 3650, left: 2, ph: 'cabin', features: ['Private balcony hatch', 'Ensuite shower', '14 m²'] },
        { code: 'TW', name: 'Familia Twin', deck: 'Lower deck', beds: 'Two singles', occupancy: 2, maxOccupancy: 3, price: 3450, left: 3, ph: 'cabin', features: ['Interconnects with a second twin', 'Ensuite shower', '13 m²'] },
        { code: 'SL', name: 'Solo Berth', deck: 'Lower deck', beds: 'Single', occupancy: 1, maxOccupancy: 1, price: 2950, left: 1, ph: 'cabin', features: ['No single supplement', 'Ensuite shower', '9 m²'] },
      ],
    },
    {
      slug: 'bintang-laut', name: 'Bintang Laut', type: 'Gaff schooner', ph: 'deep',
      tagline: 'Twelve guests, and a rig that actually gets used.',
      blurb: 'Narrower and faster than her sisters, Bintang Laut was drawn for sailing rather than motoring. Twelve guests, six cabins and a captain who will change the day’s plan for a good breeze. The boat divers ask for by name.',
      length: '28 m', beam: '7.2 m', built: 2018, refit: 2024,
      cabins: 6, guests: 12, crew: 11, cruise: '10 knots', tenders: 2,
      decks: 2, sails: 'Gaff schooner, 5 sails', charterDay: 5400,
      facilities: ['Open aft dive deck', 'Nitrox membrane', 'Two tenders with dive ladders',
        'Shaded lounge with chart table', 'Sun deck hammocks', 'Freshwater deck showers',
        'Camera table with charging bench', 'Starlink'],
      safety: ['Oxygen and first-response kit', 'DAN-affiliated evacuation cover',
        'Two liferafts, EPIRB and satellite phone', 'Crew drilled monthly'],
      gallery: ['deep', 'cabin', 'reef', 'boat'],
      cabinTypes: [
        { code: 'MD', name: 'Master Double', deck: 'Main deck', beds: 'King', occupancy: 2, maxOccupancy: 2, price: 3850, left: 1, ph: 'cabin', features: ['Corner windows', 'Ensuite shower', '15 m²'] },
        { code: 'DD', name: 'Deck Double', deck: 'Main deck', beds: 'Queen', occupancy: 2, maxOccupancy: 2, price: 3450, left: 2, ph: 'cabin', features: ['Opening port', 'Ensuite shower', '12 m²'] },
        { code: 'TW', name: 'Sailor Twin', deck: 'Lower deck', beds: 'Two singles', occupancy: 2, maxOccupancy: 2, price: 3180, left: 2, ph: 'cabin', features: ['Reading lights', 'Ensuite shower', '11 m²'] },
        { code: 'SL', name: 'Solo Berth', deck: 'Lower deck', beds: 'Single', occupancy: 1, maxOccupancy: 1, price: 2680, left: 0, ph: 'cabin', features: ['No single supplement', 'Shared shower', '8 m²'] },
      ],
    },
    {
      slug: 'nusa-ombak', name: 'Nusa Ombak', type: 'Large phinisi', ph: 'sunset',
      tagline: 'Room for the whole extended family, cousins included.',
      blurb: 'Forty metres, twenty guests, ten cabins — four of which interconnect. Nusa Ombak is where multi-generation groups and family charters end up, with a shaded deck big enough that nobody has to negotiate for a chair.',
      length: '40 m', beam: '9.6 m', built: 2020, refit: 2025,
      cabins: 10, guests: 20, crew: 17, cruise: '9 knots', tenders: 3,
      decks: 4, sails: 'Ketch rig, 7 sails', charterDay: 9500,
      facilities: ['Two shaded lounges', 'Sun deck with plunge pool', 'Three tenders',
        'Nitrox membrane', 'Kids’ reef-school corner', 'Two massage rooms',
        'Cinema screen on the sky deck', 'Camera room', 'Starlink and hot water throughout'],
      safety: ['Oxygen on three decks', 'DAN-affiliated evacuation cover',
        'Three liferafts, EPIRB and satellite phone', 'Two crew with wilderness-medic training'],
      gallery: ['sunset', 'cabin', 'lagoon', 'boat'],
      cabinTypes: [
        { code: 'OS', name: 'Owner’s Suite', deck: 'Sky deck', beds: 'King', occupancy: 2, maxOccupancy: 3, price: 5400, left: 1, ph: 'cabin', features: ['Private terrace', 'Tub and rain shower', 'Day bed', '26 m²'] },
        { code: 'FS', name: 'Family Suite', deck: 'Main deck', beds: 'King + two singles', occupancy: 4, maxOccupancy: 4, price: 4200, left: 2, ph: 'cabin', features: ['Interconnecting door', 'Two ensuites', '24 m²'] },
        { code: 'UD', name: 'Upper Double', deck: 'Upper deck', beds: 'Queen', occupancy: 2, maxOccupancy: 3, price: 3900, left: 3, ph: 'cabin', features: ['Sea-view window', 'Ensuite shower', '15 m²'] },
        { code: 'TW', name: 'Ombak Twin', deck: 'Lower deck', beds: 'Two singles', occupancy: 2, maxOccupancy: 2, price: 3500, left: 4, ph: 'cabin', features: ['Interconnects', 'Ensuite shower', '13 m²'] },
      ],
    },
    {
      slug: 'layar-kecil', name: 'Layar Kecil', type: 'Intimate ketch', ph: 'night',
      tagline: 'Eight guests. Often booked whole, by one family.',
      blurb: 'The small one, and deliberately so. Four cabins, eight guests, nine crew — which is very nearly one crew member each. Layar Kecil goes into anchorages the bigger boats cannot enter, and half her season runs as private charter.',
      length: '24 m', beam: '6.4 m', built: 2021, refit: 2025,
      cabins: 4, guests: 8, crew: 9, cruise: '9 knots', tenders: 1,
      decks: 2, sails: 'Ketch rig, 5 sails', charterDay: 4200,
      facilities: ['Single shaded lounge, guest-run playlist', 'Foredeck yoga mats',
        'One tender, always available', 'Nitrox on request', 'Freshwater deck shower',
        'Massage on the aft deck', 'Small library', 'Starlink'],
      safety: ['Oxygen and first-response kit', 'DAN-affiliated evacuation cover',
        'Liferaft, EPIRB and satellite phone', 'Crew drilled monthly'],
      gallery: ['night', 'cabin', 'jungle', 'boat'],
      cabinTypes: [
        { code: 'MD', name: 'Master Double', deck: 'Main deck', beds: 'King', occupancy: 2, maxOccupancy: 2, price: 4400, left: 1, ph: 'cabin', features: ['Full-beam cabin', 'Ensuite with tub', '20 m²'] },
        { code: 'DD', name: 'Deck Double', deck: 'Main deck', beds: 'Queen', occupancy: 2, maxOccupancy: 2, price: 3950, left: 1, ph: 'cabin', features: ['Opening port', 'Ensuite shower', '14 m²'] },
        { code: 'TW', name: 'Kecil Twin', deck: 'Lower deck', beds: 'Two singles', occupancy: 2, maxOccupancy: 2, price: 3600, left: 2, ph: 'cabin', features: ['Ensuite shower', '12 m²'] },
        { code: 'SL', name: 'Solo Berth', deck: 'Lower deck', beds: 'Single', occupancy: 1, maxOccupancy: 1, price: 3100, left: 1, ph: 'cabin', features: ['No single supplement', 'Ensuite shower', '9 m²'] },
      ],
    },
  ];

  /* ==========================================================================
     5. Content — Trips (journeys). `party` drives the guided-discovery funnel.
     ======================================================================== */
  const trips = [
    {
      slug: 'manta-passage', title: 'Manta Passage', water: 'komodo', boat: 'familia-satu',
      nights: 7, from: 3450, ph: 'reef', experiences: ['diving', 'light'],
      party: ['couples', 'friends', 'solo'], editorPick: true, gateway: 'Labuan Bajo',
      summary: 'A full week on the current lines of the Flores Sea, timed so the tide is right at the cleaning stations rather than merely convenient.',
      story: 'We built this one around slack water. Every anchorage is chosen so that the tide turns while you are on the reef, which is when the mantas queue up over the sand at Karang Makassar and the ridge at Batu Bolong fills from below. Between dives there is Padar before the crowds, a ranger walk on Rinca at first light, and a long sail home with the sails actually up.',
      highlights: ['Four dives a day at slack water', 'Padar ridge before the day boats', 'Ranger walk on Rinca at 5:40am'],
      route: [
        { day: '1', title: 'Labuan Bajo — board and go', text: 'Aboard by 2pm, check dive, then a short sail to Sebayur for the first night at anchor.' },
        { day: '2', title: 'Batu Bolong & Tatawa', text: 'The hard-coral ridge on the turn of the tide, then a drift over Tatawa’s garden.' },
        { day: '3', title: 'Karang Makassar', text: 'Mantas on the sand flat at slack, twice. Afternoon on Pink Beach.' },
        { day: '4', title: 'Padar & Rinca', text: 'Padar ridge at 5am, breakfast under way, rangers on Rinca before the heat.' },
        { day: '5', title: 'Crystal & Castle Rock', text: 'North Komodo’s two seamounts, both with schooling trevally. Night dive at Siaba.' },
        { day: '6', title: 'Sabolan, sails up', text: 'One long dive, then a sailing afternoon back west. Kitchen does the whole-fish dinner.' },
        { day: '7', title: 'Labuan Bajo', text: 'Last shallow reef at dawn, alongside by 8am, transfers to the airport.' },
      ],
    },
    {
      slug: 'lagoons-little-explorers', title: 'Lagoons & Little Explorers', water: 'komodo',
      boat: 'nusa-ombak', nights: 5, from: 2680, ph: 'lagoon',
      experiences: ['family', 'wellness'], party: ['families'], gateway: 'Labuan Bajo',
      summary: 'Five nights of shallow water and short crossings, with a crew who run reef school in the morning and plankton hunts after dark.',
      story: 'Nothing on this route takes more than three hours to reach, and nothing is deeper than it needs to be. Children get snorkel lessons in a lagoon they can stand up in, then graduate to the reef top with a crew member each. Parents get the aft deck, two massage rooms and dinner at whatever time the day turned out to allow.',
      highlights: ['Standing-depth lagoon for snorkel lessons', 'Night-time plankton hunt off the swim platform', 'Kayaks and paddleboards on every anchorage'],
    },
    {
      slug: 'the-four-kings', title: 'The Four Kings', water: 'raja-ampat', boat: 'nusa-ombak',
      nights: 10, from: 5900, ph: 'reef', experiences: ['diving', 'remote', 'light'],
      party: ['couples', 'friends', 'solo'], editorPick: true, gateway: 'Sorong',
      summary: 'Ten nights across two of Raja Ampat’s four kingdoms — the fast water of Dampier Strait and the quiet karst of Misool.',
      story: 'Most Raja Ampat weeks pick one region and stay. This one crosses overnight so you get both characters: the busy, current-driven Dampier Strait where mantas commute past the tender, and Misool in the south, where the lagoons are walled in limestone and the only sound at 5am is the birds. The passage between them is the point, not the cost.',
      highlights: ['Manta highway through Dampier Strait', 'Misool’s walled lagoons at dawn', 'Overnight passage under sail'],
      route: [
        { day: '1', title: 'Sorong — board', text: 'Aboard at midday, check dive off Kri, first night in the strait.' },
        { day: '2–3', title: 'Dampier Strait', text: 'Cape Kri, Blue Magic, Sardine Reef. Fast water, big schools, four dives a day.' },
        { day: '4', title: 'Passage south', text: 'Overnight sail to Misool. Night watch open to anyone who wants it.' },
        { day: '5–7', title: 'Misool', text: 'Boo Windows, Fiabacet, Magic Mountain. Kayaks in the lagoons between dives.' },
        { day: '8', title: 'Passage north', text: 'Back up under sail, with a stop at Yangeffo’s jetty reef.' },
        { day: '9', title: 'Wayag or Aljui', text: 'Weather decides: the Wayag viewpoint, or the pearl farm and bay dives at Aljui.' },
        { day: '10', title: 'Sorong', text: 'Dawn dive on Kri, alongside mid-morning, transfers to the airport.' },
      ],
    },
    {
      slug: 'misool-slowly', title: 'Misool, Slowly', water: 'raja-ampat', boat: 'layar-kecil',
      nights: 7, from: 4400, ph: 'jungle', experiences: ['wellness', 'remote', 'light'],
      party: ['couples', 'solo'], gateway: 'Sorong',
      summary: 'One region, one week, eight guests. The itinerary is a list of anchorages we might use, in no fixed order.',
      story: 'Layar Kecil is small enough to slip into the lagoons the bigger boats have to admire from outside. There is no schedule beyond breakfast: the captain reads the weather each morning and picks. Some days that means three dives, some days one dive and a very long afternoon of nothing at all.',
      highlights: ['Anchorages chosen each morning, not in advance', 'Foredeck yoga at 6am, optional', 'Eight guests, nine crew'],
    },
    {
      slug: 'the-volcano-run', title: 'The Volcano Run', water: 'banda', boat: 'familia-satu',
      nights: 12, from: 6750, ph: 'volcano', experiences: ['remote', 'diving', 'culture'],
      party: ['couples', 'friends', 'solo'], editorPick: true, gateway: 'Ambon to Ambon',
      summary: 'Twelve nights of open water, seamounts that appear from nowhere, and the nutmeg town that once traded island-for-island with Manhattan.',
      story: 'The Banda Sea is the crossing the crew signs up for. Three overnight passages, seamounts rising out of two thousand metres, and the lava flow off Gunung Api where hard coral colonised bare rock after the 1988 eruption and now runs unbroken to forty. In between there is Banda Neira: a Dutch colonial town gone gently to seed, nutmeg still drying on the same racks behind Fort Belgica.',
      highlights: ['The 1988 lava flow, now solid coral', 'Manuk’s sea snakes, dozens at a time', 'Nutmeg gardens with the family who farm them'],
      route: [
        { day: '1', title: 'Ambon — board', text: 'Aboard by 3pm. Check dive on Ambon’s muck slope, then east overnight.' },
        { day: '2–3', title: 'Nusa Laut & Koon', text: 'Two days of walls and one very large school of surgeonfish at Koon.' },
        { day: '4', title: 'Passage south', text: 'Overnight to Banda. Sails up, night watch open.' },
        { day: '5–6', title: 'Banda Neira', text: 'The lava flow, Hatta’s wall, then the town: fort, archive, nutmeg gardens.' },
        { day: '7', title: 'Manuk', text: 'The sea-snake island. Dozens in the water with you, none of them interested.' },
        { day: '8', title: 'Nil Desperandum', text: 'Seamount out of the blue. Hammerhead season if the timing holds.' },
        { day: '9–10', title: 'Serua & Gunung Api', text: 'Volcanic slopes, black sand, and a long sail with nothing on the horizon.' },
        { day: '11', title: 'Passage north', text: 'The last overnight. Kitchen does the crossing dinner on the aft deck.' },
        { day: '12', title: 'Ambon', text: 'Alongside by 8am. Transfers to the airport or a night in town.' },
      ],
    },
    {
      slug: 'hammerhead-season', title: 'Hammerhead Season', water: 'banda',
      boat: 'bintang-laut', nights: 9, from: 5200, ph: 'deep', experiences: ['diving', 'remote'],
      party: ['friends', 'solo'], gateway: 'Ambon to Saumlaki',
      summary: 'Nine nights aimed squarely at the seamounts, in the two-week window when the schools show up.',
      story: 'A dive-first itinerary with no apologies. Bintang Laut is the fast boat, so we can afford to sit on a seamount for two days waiting for conditions rather than moving on. Four dives a day when the water allows, and a briefing that tells you honestly what the odds are.',
      highlights: ['Two days held at Nil Desperandum', 'Four dives a day, small groups', 'Honest odds in every briefing'],
    },
    {
      slug: 'weavers-of-solor', title: 'Weavers of Solor', water: 'alor', boat: 'bintang-laut',
      nights: 8, from: 4150, ph: 'village', experiences: ['culture', 'diving'],
      party: ['couples', 'solo', 'friends'], gateway: 'Maumere to Kupang',
      summary: 'Eight nights through the Solor archipelago with the weaving families we have visited for eleven years, and cold-water reefs in between.',
      story: 'This route exists because of one family in Lamalera and one in Solor. We arrive when they say to arrive, sit on the floor, and watch cotton become thread become cloth over an afternoon. Nobody performs. Between villages the straits pull cold water up from the deep, which makes for muck diving full of things you will not see further west.',
      highlights: ['A full afternoon at the loom, not a photo stop', 'Cold-water muck slopes off Alor', 'Whale-bone chapel on Lembata'],
    },
    {
      slug: 'soft-coral-country', title: 'Soft Coral Country', water: 'triton',
      boat: 'familia-satu', nights: 9, from: 5350, ph: 'reef',
      experiences: ['diving', 'remote', 'light'], party: ['couples', 'friends', 'solo'],
      gateway: 'Kaimana',
      summary: 'Nine nights in green water where the soft coral grows in colours that look like a slider slipped.',
      story: 'Triton Bay does not do visibility. It does density: walls of soft coral in orange and magenta, whale sharks that have learned the fishing platforms mean an easy meal, and karst cliffs with rock paintings nobody can date. Bring a wide lens and low expectations about the blue.',
      highlights: ['Full walls of orange soft coral', 'Whale sharks under the bagans', 'Undated rock paintings on the karst'],
    },
    {
      slug: 'whale-sharks-of-cenderawasih', title: 'Whale Sharks of Cenderawasih',
      water: 'cenderawasih', boat: 'nusa-ombak', nights: 11, from: 6300, ph: 'deep',
      experiences: ['diving', 'family', 'remote'], party: ['families', 'couples', 'friends'],
      gateway: 'Nabire to Manokwari',
      summary: 'Eleven nights in the one bay where whale sharks are residents, so guests get hours with them rather than minutes.',
      story: 'The sharks in Kwatisore do not migrate. They live under the bagan platforms, and the fishermen have a decades-old understanding with them. That means multiple long sessions rather than one lucky encounter — which is also why this trip works for children, who can snorkel above while divers stay below.',
      highlights: ['Repeat sessions with resident whale sharks', 'Shallow WWII wrecks for all levels', 'Endemic reef fish found nowhere else'],
    },
    {
      slug: 'atoll-drift', title: 'Atoll Drift', water: 'wakatobi', boat: 'bintang-laut',
      nights: 6, from: 3280, ph: 'lagoon', experiences: ['diving', 'wellness'],
      party: ['couples', 'solo'], gateway: 'Wangi-Wangi',
      summary: 'Six nights drifting the Tukang Besi wall, with a reef top so healthy you will forget to look down.',
      story: 'The chain is essentially one long drop-off, which makes for the laziest good diving in Indonesia: roll off the tender, let the water take you, surface an hour later somewhere else. Between dives, the Bajo stilt village on Kaledupa, and a schedule with room in it.',
      highlights: ['Drift diving straight off the reef top', 'Bajo stilt village on Kaledupa', 'Night dive on Hoga’s slope'],
    },
    {
      slug: 'the-spice-route', title: 'The Spice Route', water: 'halmahera',
      boat: 'familia-satu', nights: 10, from: 5750, ph: 'market',
      experiences: ['culture', 'remote'], party: ['couples', 'friends', 'solo'],
      gateway: 'Ternate',
      summary: 'Ten nights through the original spice islands, with reefs that are genuinely still being surveyed.',
      story: 'Two volcanic cones facing each other across a strait supplied Europe’s entire clove trade for two centuries, and the terraces are still there on the slopes. We walk them with a guide whose family farms them, read in the sultan’s archive in Ternate, then head south along west Halmahera where three of the dive sites have names we gave them.',
      highlights: ['Clove terraces walked with the family who farm them', 'Sultan’s archive in Ternate', 'Three dive sites we named ourselves'],
    },
    {
      slug: 'three-nights-four-islands', title: 'Three Nights, Four Islands', water: 'komodo',
      boat: 'layar-kecil', nights: 3, from: 1590, ph: 'lagoon',
      experiences: ['family', 'wellness'], party: ['families', 'couples', 'friends'],
      gateway: 'Labuan Bajo',
      summary: 'A short one, for people with a long flight home. Four anchorages, no crossings longer than two hours.',
      story: 'Built for the guest who has three nights and does not want to spend them travelling. Eight guests on the small boat, four anchorages within easy reach of Labuan Bajo, and enough time in each to actually swim twice.',
      highlights: ['Nothing further than two hours away', 'Whole boat often taken by one group', 'Padar at dawn on the last morning'],
    },
  ];

  /* What a cabin fare covers. Brand-level default; a trip may override either
     list with its own `included` / `excluded` array. */
  const inclusions = {
    included: [
      'All meals, snacks and soft drinks',
      'Filtered water, tea and coffee, always on',
      'Cabin with private ensuite and hot water',
      'Up to four dives a day where the route allows',
      'Tanks, weights, guides and nitrox for certified divers',
      'Snorkelling gear, kayaks and paddleboards',
      'Airport transfers on embarkation and disembarkation days',
      'National park and marine conservation fees',
      'Starlink wifi',
    ],
    excluded: [
      'Flights to and from the gateway port',
      'Dive equipment rental (available on board)',
      'Alcohol — bring your own, no corkage',
      'Massage and spa treatments',
      'Travel and diving insurance (required)',
      'Crew gratuities, entirely at your discretion',
    ],
  };

  /* ==========================================================================
     6. Content — Departures. status: open | limited | waitlist | closed
     ======================================================================== */
  const departures = [
    { id: 'SFD-2608-MPA', trip: 'manta-passage', boat: 'familia-satu', start: '2026-08-22', nights: 7, cabinsLeft: 2, price: 3450, status: 'limited', deposit: 0.25 },
    { id: 'SFD-2609-TFK', trip: 'the-four-kings', boat: 'nusa-ombak', start: '2026-09-06', nights: 10, cabinsLeft: 5, price: 5900, status: 'open', deposit: 0.25 },
    { id: 'SFD-2609-WOS', trip: 'weavers-of-solor', boat: 'bintang-laut', start: '2026-09-14', nights: 8, cabinsLeft: 3, price: 4150, status: 'open', deposit: 0.25 },
    { id: 'SFD-2609-TVR', trip: 'the-volcano-run', boat: 'familia-satu', start: '2026-09-24', nights: 12, cabinsLeft: 1, price: 6750, status: 'limited', deposit: 0.30 },
    { id: 'SFD-2610-HHS', trip: 'hammerhead-season', boat: 'bintang-laut', start: '2026-10-04', nights: 9, cabinsLeft: 0, price: 5200, status: 'waitlist', deposit: 0.25 },
    { id: 'SFD-2610-LLE', trip: 'lagoons-little-explorers', boat: 'nusa-ombak', start: '2026-10-12', nights: 5, cabinsLeft: 4, price: 2680, status: 'open', deposit: 0.25 },
    { id: 'SFD-2610-TSR', trip: 'the-spice-route', boat: 'familia-satu', start: '2026-10-20', nights: 10, cabinsLeft: 4, price: 5750, status: 'open', deposit: 0.25 },
    { id: 'SFD-2611-MSL', trip: 'misool-slowly', boat: 'layar-kecil', start: '2026-11-02', nights: 7, cabinsLeft: 2, price: 4400, status: 'limited', deposit: 0.30 },
    { id: 'SFD-2611-SCC', trip: 'soft-coral-country', boat: 'familia-satu', start: '2026-11-15', nights: 9, cabinsLeft: 6, price: 5350, status: 'open', deposit: 0.25 },
    { id: 'SFD-2612-TNF', trip: 'three-nights-four-islands', boat: 'layar-kecil', start: '2026-12-04', nights: 3, cabinsLeft: 1, price: 1590, status: 'limited', deposit: 0.25 },
    { id: 'SFD-2612-TFK', trip: 'the-four-kings', boat: 'nusa-ombak', start: '2026-12-18', nights: 10, cabinsLeft: 0, price: 6400, status: 'closed', deposit: 0.25 },
    { id: 'SFD-2701-ADR', trip: 'atoll-drift', boat: 'bintang-laut', start: '2027-01-09', nights: 6, cabinsLeft: 5, price: 3280, status: 'open', deposit: 0.25 },
    { id: 'SFD-2702-WSC', trip: 'whale-sharks-of-cenderawasih', boat: 'nusa-ombak', start: '2027-02-06', nights: 11, cabinsLeft: 7, price: 6300, status: 'open', deposit: 0.25 },
    { id: 'SFD-2703-MPA', trip: 'manta-passage', boat: 'familia-satu', start: '2027-03-14', nights: 7, cabinsLeft: 8, price: 3450, status: 'open', deposit: 0.25 },
    { id: 'SFD-2704-TVR', trip: 'the-volcano-run', boat: 'familia-satu', start: '2027-04-02', nights: 12, cabinsLeft: 6, price: 6750, status: 'open', deposit: 0.30 },
    { id: 'SFD-2705-MSL', trip: 'misool-slowly', boat: 'layar-kecil', start: '2027-05-08', nights: 7, cabinsLeft: 3, price: 4400, status: 'open', deposit: 0.30 },
  ];

  /* ==========================================================================
     7. Content — Journal
     ======================================================================== */
  const articles = [
    {
      slug: 'reading-the-current', title: 'Reading the Current', category: 'Craft',
      dek: 'Our cruise director has never used a dive computer to decide when to get in the water. She reads the surface instead.',
      author: 'Ayu Prasetya', role: 'Cruise director, Familia Satu',
      date: '2026-06-18', read: 8, ph: 'deep', featured: true,
      tags: ['diving', 'crew', 'komodo'],
      body: [
        { t: 'p', v: 'There is a line of water off Batu Bolong that appears about forty minutes before slack. It is not dramatic. If you were not looking for it you would call it a shadow, or a patch where the wind sits differently on the surface. Ayu has been watching it since she was fourteen, from her uncle’s outrigger, and she will tell you it is more reliable than any tide table printed in Jakarta.' },
        { t: 'h2', v: 'What the table cannot know' },
        { t: 'p', v: 'Tide tables are computed for ports. They assume a coastline, a basin, a set of averages. What they cannot know is that a ridge sitting at right angles to the flow will hold a back-eddy for another twenty minutes after the main body of water has given up, or that three days of northerly wind stacks water into the strait and delays everything by half an hour.' },
        { t: 'quote', v: 'The sea does not run late. Our arithmetic does.' },
        { t: 'p', v: 'So the briefing on Familia Satu happens twice: once the night before, with the chart and the numbers, and once at the rail, ten minutes before we get in, with nothing but the surface to go on. The second briefing is the one that changes plans. Guests are sometimes surprised that a boat with Starlink and a nitrox membrane makes its most important daily decision by eye.' },
        { t: 'h2', v: 'Learning to see it' },
        { t: 'p', v: 'It is teachable, mostly. Look for the seam — the place where two textures of water meet and neither wins. Watch a floating leaf for thirty seconds rather than one. Notice which way the mooring lines of the fishing boats are lying, because they have been integrating the current all morning and you have not.' },
        { t: 'p', v: 'What is harder to teach is the patience to wait when the water says wait. There is always a guest who has flown a long way and wants to be in it now. The answer is the same as it was on the outrigger: the reef is not going anywhere, and the mantas will not come while the water is still moving. Sit down. Have the second coffee.' },
      ],
    },
    {
      slug: 'the-kitchen-on-a-swell', title: 'The Kitchen on a Swell', category: 'Kitchen',
      dek: 'How Pak Rudi cooks for sixteen on a boat with no gimballed stove and a three-metre swell running.',
      author: 'Rudi Hartawan', role: 'Head cook, Familia Satu',
      date: '2026-05-29', read: 6, ph: 'market', featured: false,
      tags: ['crew', 'food', 'banda'],
    },
    {
      slug: 'a-reef-that-grew-on-lava', title: 'A Reef That Grew on Lava',
      category: 'Reefs',
      dek: 'In 1988 Gunung Api erupted and buried the reef under rock. Thirty-eight years later it is the healthiest hard coral in the Banda Sea.',
      author: 'Dr. Lila Moerdani', role: 'Marine biologist, guest lecturer',
      date: '2026-05-11', read: 11, ph: 'volcano', featured: true,
      tags: ['reefs', 'banda', 'science'],
      body: [
        { t: 'p', v: 'The lava reached the water on the north-west side of Gunung Api in May 1988 and kept going, down the slope, over everything. Divers who went in that year described a grey desert with nothing on it. The most interesting reef in the Banda Sea is now growing on top of that desert, and it got there fast enough to embarrass the literature.' },
        { t: 'h2', v: 'Why it worked' },
        { t: 'p', v: 'Fresh volcanic rock is, from a coral larva’s point of view, close to ideal: hard, clean, rough enough to grip, and utterly uncontested. No algae had a head start. No sponge held the ground. Add the Banda Sea’s nutrient-rich upwellings and a location squarely in the path of larval drift from a dozen healthy reefs, and the slope was colonised in a decade rather than the three or four the textbooks would predict.' },
        { t: 'quote', v: 'It is the only place I take students where the reef has a birthday.' },
        { t: 'p', v: 'What you see now is a table-coral field running from three metres to past forty, dense enough that finding sand to put a camera down on is a genuine problem. The colonies are all roughly the same age, which gives the whole slope an eerie uniformity — no ancient massive corals, no gaps, just a single generation that arrived together and has been growing ever since.' },
        { t: 'h2', v: 'The uncomfortable part' },
        { t: 'p', v: 'It is tempting to read the lava flow as reassurance: reefs bounce back, the sea repairs itself, relax. That is the wrong lesson. The flow recovered because everything around it was healthy enough to reseed it, the water was clean, and nothing was fishing it while it grew. Take away any one of those and the grey desert stays a grey desert. Recovery is not a property of coral. It is a property of a neighbourhood.' },
      ],
    },
    {
      slug: 'eleven-years-at-one-loom', title: 'Eleven Years at One Loom',
      category: 'Places',
      dek: 'What changes, and what refuses to, in a Solor weaving village visited by the same boat every September.',
      author: 'Ayu Prasetya', role: 'Cruise director, Familia Satu',
      date: '2026-04-22', read: 9, ph: 'village', featured: false,
      tags: ['culture', 'alor', 'community'],
    },
    {
      slug: 'why-we-stopped-selling-fourteen-guests', title: 'Why We Stopped Selling Fourteen Guests',
      category: 'Familia',
      dek: 'Familia Satu sleeps sixteen. For two seasons we sold fourteen, and the numbers were better. Here is why we changed back.',
      author: 'Bimo Santoso', role: 'Co-founder',
      date: '2026-03-30', read: 5, ph: 'boat', featured: false,
      tags: ['familia', 'business'],
    },
    {
      slug: 'the-bagan-agreement', title: 'The Bagan Agreement', category: 'Conservation',
      dek: 'The whale sharks of Kwatisore are protected by an arrangement nobody wrote down.',
      author: 'Dr. Lila Moerdani', role: 'Marine biologist, guest lecturer',
      date: '2026-03-08', read: 10, ph: 'deep', featured: false,
      tags: ['conservation', 'cenderawasih', 'science'],
    },
    {
      slug: 'night-watch', title: 'Night Watch', category: 'Craft',
      dek: 'On the Banda crossing, guests are welcome on the 2am watch. Most who try it do it again the next night.',
      author: 'Captain Yos Tanuwijaya', role: 'Master, Bintang Laut',
      date: '2026-02-14', read: 7, ph: 'night', featured: false,
      tags: ['sailing', 'banda', 'crew'],
    },
    {
      slug: 'what-we-buy-in-the-market', title: 'What We Buy in the Market',
      category: 'Kitchen',
      dek: 'A provisioning list from one Thursday in Labuan Bajo, and the reason there is no salmon on it.',
      author: 'Rudi Hartawan', role: 'Head cook, Familia Satu',
      date: '2026-01-26', read: 6, ph: 'market', featured: false,
      tags: ['food', 'sustainability', 'komodo'],
    },
  ];

  /* Fallback body for articles whose long-form copy has not been written yet —
     stands in for a CMS field that has not been filled. */
  function bodyFor(a) {
    if (a && a.body && a.body.length) return a.body;
    if (!a) return [];
    return [
      { t: 'p', v: a.dek },
      { t: 'h2', v: 'From the boat' },
      { t: 'p', v: 'This piece is part of the Sea Familia journal, written by the people who are actually on the water — crew, cooks, captains and the biologists who join us as guest lecturers. We publish about twice a month, in between seasons and whenever somebody has something worth saying.' },
      { t: 'quote', v: 'Nobody on this boat is a content producer. That is rather the point.' },
      { t: 'p', v: 'If you would like the full piece as soon as it is edited, the familia letter goes out monthly and contains no marketing beyond the occasional note that a departure has opened up.' },
    ];
  }

  /* ==========================================================================
     8. Content — the familia, FAQ
     ======================================================================== */
  const team = [
    { slug: 'bimo-santoso', name: 'Bimo Santoso', role: 'Co-founder', home: 'Bira, South Sulawesi', ph: 'portrait', note: 'Grandson of a Konjo shipwright. Signed the loan for Familia Satu at 29 and still checks every hull himself.' },
    { slug: 'ratih-santoso', name: 'Ratih Santoso', role: 'Co-founder', home: 'Labuan Bajo', ph: 'portrait', note: 'Ran the office out of a spare room for three years. Handles every charter enquiry personally, which is why they take a day.' },
    { slug: 'ayu-prasetya', name: 'Ayu Prasetya', role: 'Cruise director', home: 'Labuan Bajo', ph: 'portrait', note: 'Learned the currents from her uncle’s outrigger at fourteen. Has logged over four thousand dives in the Flores Sea.' },
    { slug: 'yos-tanuwijaya', name: 'Captain Yos Tanuwijaya', role: 'Master, Bintang Laut', home: 'Ambon', ph: 'portrait', note: 'Twenty-two Banda crossings. Will change the day’s plan for a good breeze and make no apology.' },
    { slug: 'rudi-hartawan', name: 'Rudi Hartawan', role: 'Head cook', home: 'Makassar', ph: 'portrait', note: 'Cooks for sixteen with no gimballed stove. Buys whatever the market had, which is why the menu is written at 6am.' },
    { slug: 'lila-moerdani', name: 'Dr. Lila Moerdani', role: 'Marine biologist', home: 'Bogor', ph: 'portrait', note: 'Joins four crossings a season as guest lecturer. Runs the reef-monitoring plots the crew survey each month.' },
  ];

  const faq = [
    { group: 'Booking', q: 'What is the difference between an open trip and a private charter?', a: 'An open trip is a scheduled departure where you reserve a cabin and share the boat with other guests — usually eight to twenty of you. A private charter is the whole boat, on your dates, with an itinerary we build with you. Open trips are priced per person; charters are priced per boat per day.' },
    { group: 'Booking', q: 'How much deposit do you take?', a: 'Twenty-five percent of the cabin total to confirm your place, thirty percent on the twelve-night Banda crossings. The balance is due sixty days before departure. Nothing is charged to your card during this reservation — we send a payment link once a human has confirmed availability.' },
    { group: 'Booking', q: 'What happens after I reserve?', a: 'You get a booking reference immediately and an email within a few minutes. Someone from the office — usually Ratih — replies within one working day with the payment link, joining instructions and a form for dietary and diving details.' },
    { group: 'Booking', q: 'Can I hold a cabin without paying?', a: 'Yes, for seventy-two hours. Reserve as normal and tell us in the notes field; we will hold it and not send the payment link until you confirm.' },
    { group: 'On board', q: 'Do I need to be a certified diver?', a: 'Not on most routes. Every itinerary works for confident snorkellers, and several are built for families where only some of the group dives. The Banda and Cenderawasih crossings are the exception: they are long, remote and genuinely diving-led.' },
    { group: 'On board', q: 'Is there wifi?', a: 'Starlink on all four boats, and it mostly works. We do ask guests to leave calls until after dinner, because the aft deck is small and everyone can hear you.' },
    { group: 'On board', q: 'What about children?', a: 'Very welcome from four upwards, and two of our routes are built specifically around them. Nusa Ombak has interconnecting family suites and a crew who run reef school in the mornings.' },
    { group: 'On board', q: 'Can you handle dietary requirements?', a: 'Yes, including vegan, coeliac, nut allergies and halal, and we would rather know eight weeks out than eight hours. Pak Rudi buys at the market the morning we sail, so tell us early and it simply gets bought.' },
    { group: 'Money & policy', q: 'Which currencies can I pay in?', a: 'USD, IDR, EUR, AUD and SGD. Prices on this site convert at a rate we refresh weekly; the invoice is issued in the currency you choose at checkout and that is the rate you pay.' },
    { group: 'Money & policy', q: 'What is your cancellation policy?', a: 'Full refund of the deposit up to ninety days out, fifty percent up to sixty days, and no refund inside sixty days — though we will move you to another departure in the same season at no charge, once, whatever the notice.' },
    { group: 'Money & policy', q: 'Do I need insurance?', a: 'Yes, and it must cover diving to the depth you intend to dive plus emergency evacuation. We are DAN-affiliated and will ask for your policy number with the joining form.' },
    { group: 'Money & policy', q: 'What if the weather changes the itinerary?', a: 'It will, and the captain decides. Every itinerary on this site is a plan rather than a promise; we publish the anchorages we intend to use and swap them freely for safety or for a better day. We do not refund for weather changes, but we have never had a guest tell us the swap was worse.' },
  ];

  /* ==========================================================================
     9. Lookups + filtering
     ======================================================================== */
  const byWater = (slug) => waters.find((w) => w.slug === slug) || null;
  const byBoat = (slug) => boats.find((b) => b.slug === slug) || null;
  const byTrip = (slug) => trips.find((tr) => tr.slug === slug) || null;
  const byExperience = (slug) => experiences.find((e) => e.slug === slug) || null;
  const byArticle = (slug) => articles.find((a) => a.slug === slug) || null;
  const byDeparture = (id) => departures.find((d) => d.id === id) || null;
  /* Articles store the byline as a plain name string (`author:`), not a slug —
     this is the only way to get from that name back to the person's own
     record (and their photo path, which is keyed on their slug like everyone
     else's content). */
  const byPerson = (name) => team.find((p) => p.name === name) || null;

  /** Length buckets used by every trip filter in the product. */
  const lengths = [
    { slug: 'short', label: '3 – 5 nights', min: 0, max: 5, note: 'A long weekend' },
    { slug: 'classic', label: '6 – 8 nights', min: 6, max: 8, note: 'The classic week' },
    { slug: 'long', label: '9 – 14 nights', min: 9, max: 99, note: 'A real crossing' },
  ];
  const parties = [
    { slug: 'couples', label: 'Two of us', note: 'Couples and pairs' },
    { slug: 'families', label: 'With children', note: 'Families, 4 years up' },
    { slug: 'friends', label: 'A group of friends', note: 'Four or more' },
    { slug: 'solo', label: 'On my own', note: 'No single supplement' },
  ];

  function lengthOf(nights) {
    const b = lengths.find((l) => nights >= l.min && nights <= l.max);
    return b ? b.slug : 'classic';
  }

  /** Central trip filter. Every unset key is ignored, so it doubles as "all". */
  function filterTrips(f) {
    const q = f || {};
    const needle = (q.q || '').trim().toLowerCase();
    return trips.filter((tr) => {
      if (q.water && tr.water !== q.water) return false;
      if (q.boat && tr.boat !== q.boat) return false;
      if (q.experience && tr.experiences.indexOf(q.experience) === -1) return false;
      if (q.length && lengthOf(tr.nights) !== q.length) return false;
      if (q.party && tr.party.indexOf(q.party) === -1) return false;
      if (needle) {
        const hay = (tr.title + ' ' + tr.summary + ' ' + (byWater(tr.water) || {}).name).toLowerCase();
        if (hay.indexOf(needle) === -1) return false;
      }
      return true;
    });
  }

  function filterDepartures(f) {
    const q = f || {};
    return departures.filter((d) => {
      const tr = byTrip(d.trip);
      if (!tr) return false;
      if (q.water && tr.water !== q.water) return false;
      if (q.boat && d.boat !== q.boat) return false;
      if (q.experience && tr.experiences.indexOf(q.experience) === -1) return false;
      if (q.length && lengthOf(d.nights) !== q.length) return false;
      if (q.month && d.start.slice(0, 7) !== q.month) return false;
      if (q.guests && d.cabinsLeft * 2 < Number(q.guests)) return false;
      if (q.available && (d.status === 'closed' || d.status === 'waitlist')) return false;
      return true;
    }).sort((a, b) => (a.start < b.start ? -1 : 1));
  }

  function departuresFor(tripSlug) {
    return departures.filter((d) => d.trip === tripSlug && d.status !== 'closed')
      .sort((a, b) => (a.start < b.start ? -1 : 1));
  }
  function departuresOnBoat(boatSlug) {
    return departures.filter((d) => d.boat === boatSlug && d.status !== 'closed')
      .sort((a, b) => (a.start < b.start ? -1 : 1));
  }
  function tripsOnBoat(boatSlug) {
    return trips.filter((tr) => tr.boat === boatSlug);
  }
  function tripsInWater(waterSlug) {
    return trips.filter((tr) => tr.water === waterSlug);
  }

  /** Months present in the departure set — feeds the month select. */
  function departureMonths() {
    const seen = [];
    departures.forEach((d) => {
      const key = d.start.slice(0, 7);
      if (seen.indexOf(key) === -1) seen.push(key);
    });
    return seen.sort().map((key) => ({ value: key, label: fmt.monthLabel(key + '-01') }));
  }

  /** Day-by-day route. Hand-written where we have it, otherwise built from the
      destination's anchorage list so a trip page is never blank. */
  function routeFor(tr) {
    if (!tr) return [];
    if (tr.route && tr.route.length) return tr.route;
    const w = byWater(tr.water);
    if (!w) return [];
    const stops = w.stops || [];
    const out = [];
    const n = Math.min(tr.nights, stops.length);
    for (let i = 0; i < n; i++) {
      const first = i === 0, last = i === n - 1;
      out.push({
        day: String(i + 1),
        title: stops[i] + (first ? ' — board and go' : last ? ' — alongside' : ''),
        text: first
          ? 'Aboard by early afternoon, check dive, then a short sail to the first anchorage.'
          : last
            ? 'A last shallow reef at dawn, alongside mid-morning, transfers to the airport.'
            : 'Diving and shore time around ' + stops[i] + ', with the day’s order set by the water.',
        provisional: true,
      });
    }
    return out;
  }

  /** Global search across every content type — powers the header search panel. */
  function search(term) {
    const n = (term || '').trim().toLowerCase();
    if (n.length < 2) return { trips: [], waters: [], boats: [], articles: [], total: 0 };
    const hit = (s) => (s || '').toLowerCase().indexOf(n) !== -1;
    const r = {
      trips: trips.filter((x) => hit(x.title) || hit(x.summary) || hit((byWater(x.water) || {}).name)).slice(0, 4),
      waters: waters.filter((x) => hit(x.name) || hit(x.blurb)).slice(0, 3),
      boats: boats.filter((x) => hit(x.name) || hit(x.type) || hit(x.tagline)).slice(0, 3),
      articles: articles.filter((x) => hit(x.title) || hit(x.dek) || hit(x.category)).slice(0, 3),
    };
    r.total = r.trips.length + r.waters.length + r.boats.length + r.articles.length;
    return r;
  }

  /* ==========================================================================
     10. URL helpers — also how QA forces a runtime state
         ?state=loading | empty | error   on any listing screen
     ======================================================================== */
  function query() {
    const out = {};
    const s = (window.location.search || '').replace(/^\?/, '');
    if (!s) return out;
    s.split('&').forEach((pair) => {
      if (!pair) return;
      const i = pair.indexOf('=');
      const k = decodeURIComponent(i === -1 ? pair : pair.slice(0, i));
      const v = i === -1 ? '' : decodeURIComponent(pair.slice(i + 1).replace(/\+/g, ' '));
      out[k] = v;
    });
    return out;
  }
  function forcedState() {
    const s = query().state;
    return ['loading', 'empty', 'error'].indexOf(s) !== -1 ? s : null;
  }
  function href(page, params) {
    const parts = [];
    Object.keys(params || {}).forEach((k) => {
      const v = params[k];
      if (v === undefined || v === null || v === '') return;
      parts.push(encodeURIComponent(k) + '=' + encodeURIComponent(v));
    });
    return page + (parts.length ? '?' + parts.join('&') : '');
  }

  /** Wrap a result set so `?state=empty` blanks any listing on the site.
      Used as: this.rows = SEA.emptied(SEA.filterTrips(this.f))
      (An empty array is truthy, so this cannot be inferred from load()'s value.) */
  function emptied(list) {
    return forcedState() === 'empty' ? [] : list;
  }

  /** Simulated fetch so every listing exercises its loading state once.
      Replace with the real request; keep the shape (resolve/reject). */
  function load(payload, opts) {
    const o = opts || {};
    const forced = forcedState();
    const delay = o.delay || 420;
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (forced === 'error') return reject(new Error('Forced error state (?state=error)'));
        if (forced === 'empty') return resolve(Array.isArray(payload) ? [] : null);
        resolve(payload);
      }, forced === 'loading' ? 100000 : delay);
    });
  }

  /* ==========================================================================
     11. Presentation — badges, cards, states
         All return HTML strings. They contain no Alpine directives, so they are
         safe inside x-html and can be lifted straight into a template engine.
     ======================================================================== */
  const escapeHTML = (s) => String(s === null || s === undefined ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

  const STATUS = {
    open: { key: 'st.open', cls: 'bg-mist-100 text-ink-700 ring-mist-300' },
    limited: { key: 'st.limited', cls: 'bg-flame/10 text-flame-700 ring-flame/30' },
    waitlist: { key: 'st.waitlist', cls: 'bg-sand-200 text-deep-700 ring-sand-300' },
    closed: { key: 'st.closed', cls: 'bg-sand-200 text-ink/50 ring-sand-300' },
  };

  function badge(status, extra) {
    const s = STATUS[status] || STATUS.open;
    return '<span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-mark ' +
      'font-medium uppercase tracking-[0.12em] ring-1 ring-inset ' + s.cls + '">' +
      '<span class="h-1.5 w-1.5 rounded-full bg-current opacity-70"></span>' +
      escapeHTML(t(s.key)) + (extra ? ' · ' + escapeHTML(extra) : '') + '</span>';
  }

  function chip(label) {
    return '<span class="inline-flex items-center rounded-full bg-white/15 px-2.5 py-1 text-[11px] ' +
      'font-mark uppercase tracking-[0.14em] text-white ring-1 ring-inset ring-white/25 backdrop-blur">' +
      escapeHTML(label) + '</span>';
  }

  /* Real photography, once dropped into assets/media/photos/, sits on top of
     the .ph placeholder beneath it (see the .img-slot rule in app.css) — until
     then the file 404s, onerror hides the broken-image icon, and the .ph
     gradient behind is all a guest ever sees. Path convention is per content
     slug, not per .ph-* variant, since the same variant is reused across many
     unrelated records (see docs/HANDOFF.md). */
  const photoPath = {
    trip: (slug) => 'assets/media/photos/trips/' + slug + '.jpg',
    boat: (slug) => 'assets/media/photos/boats/' + slug + '.jpg',
    boatGallery: (slug, i) => 'assets/media/photos/boats/' + slug + '-' + (i + 1) + '.jpg',
    water: (slug) => 'assets/media/photos/waters/' + slug + '.jpg',
    article: (slug) => 'assets/media/photos/articles/' + slug + '.jpg',
    experience: (slug) => 'assets/media/photos/experiences/' + slug + '.jpg',
    team: (slug) => 'assets/media/photos/team/' + slug + '.jpg',
    cabin: (boatSlug, code) => 'assets/media/photos/cabins/' + boatSlug + '-' + code + '.jpg',
  };
  function photo(src, alt) {
    return '<img class="img-slot" src="' + src + '" alt="' + escapeHTML(alt || '') +
      '" loading="lazy" onerror="this.style.display=\'none\'">';
  }

  function metaRow(items) {
    return items.filter(Boolean).map((x) =>
      '<span class="whitespace-nowrap">' + escapeHTML(x) + '</span>'
    ).join('<span class="text-mist-300" aria-hidden="true">·</span>');
  }

  const cards = {
    /** Discovery card — trip / journey. Used on home, experiences, destinations, boat. */
    trip(tr, opts) {
      const o = opts || {};
      const w = byWater(tr.water), b = byBoat(tr.boat);
      return '' +
      '<a href="' + href('trip.html', { slug: tr.slug }) + '" class="group block focus-ring-mist">' +
        '<div class="relative aspect-[4/3] overflow-hidden rounded-2xl bg-ink">' +
          '<div class="ph ph-' + tr.ph + ' absolute inset-0 transition-transform duration-700 ease-swell group-hover:scale-[1.04]">' +
            photo(photoPath.trip(tr.slug), tr.title) +
          '</div>' +
          '<div class="scrim-soft absolute inset-0"></div>' +
          (tr.editorPick
            ? '<div class="absolute left-3 top-3">' + chip('Editor’s pick') + '</div>' : '') +
          '<div class="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2">' +
            '<span class="inline-flex items-center rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-mark ' +
              'uppercase tracking-[0.14em] text-ink-700">' + escapeHTML(w ? w.short : '—') + '</span>' +
            '<span class="font-mark text-[11px] uppercase tracking-[0.14em] text-white/90">' +
              escapeHTML(fmt.nights(tr.nights)) + '</span>' +
          '</div>' +
        '</div>' +
        '<div class="pt-4">' +
          '<h3 class="font-display text-xl text-ink-700 leading-snug group-hover:text-flame-600 transition-colors">' +
            escapeHTML(tr.title) + '</h3>' +
          '<p class="mt-2 line-clamp-2 text-sm leading-relaxed text-ink/70">' + escapeHTML(tr.summary) + '</p>' +
          '<div class="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-mist-700">' +
            metaRow([b ? b.name : null, o.hideBoat ? null : (b ? b.type : null)]) +
          '</div>' +
          '<div class="mt-3 flex items-baseline gap-1.5 border-t border-sand-300 pt-3">' +
            '<span class="font-mark text-[11px] uppercase tracking-[0.16em] text-mist-700">' +
              escapeHTML(t('lbl.from')) + '</span>' +
            fmt.priceTag(tr.from, 'font-display text-lg text-deep-700') +
            '<span class="text-xs text-ink/50">' + escapeHTML(t('lbl.pp')) + '</span>' +
          '</div>' +
        '</div>' +
      '</a>';
    },

    /** Commerce card — a dated departure with availability + price. */
    departure(d, opts) {
      const o = opts || {};
      const tr = byTrip(d.trip), b = byBoat(d.boat), w = tr ? byWater(tr.water) : null;
      const closed = d.status === 'closed';
      const waitlisted = d.status === 'waitlist';
      const urgent = d.status !== 'open';

      // Round trips carry a single gateway ("Labuan Bajo"); point-to-point
      // routes store it as "Origin to Destination" — split once, here, rather
      // than teaching every screen that reads `t.gateway` the same parsing.
      const gatewayParts = tr && tr.gateway ? tr.gateway.split(' to ') : [];
      const boards = gatewayParts[0] || null;
      const disembarks = gatewayParts[1] || boards;

      const availability = closed ? t('note.fullybooked')
        : waitlisted ? t('note.waitlistopen')
        : d.cabinsLeft + ' ' + (d.cabinsLeft === 1 ? t('note.cabin_singular') : t('note.cabin_plural'));

      const cta = closed
        ? '<span class="inline-flex h-11 items-center rounded-full bg-sand-200 px-5 font-mark text-sm uppercase tracking-[0.12em] text-ink/40">' + escapeHTML(t('cta.soldout')) + '</span>'
        : waitlisted
          ? '<a href="' + href('contact.html', { ref: d.id, topic: 'waitlist' }) + '" class="inline-flex h-11 items-center rounded-full border border-ink/20 px-5 font-mark text-sm uppercase tracking-[0.12em] text-ink-700 transition hover:border-ink hover:bg-ink hover:text-white">' + escapeHTML(t('cta.waitlist')) + '</a>'
          : '<a href="' + href('departure.html', { id: d.id }) + '" class="inline-flex h-11 items-center rounded-full bg-flame px-5 font-mark text-sm uppercase tracking-[0.12em] text-white transition hover:bg-flame-600">' + escapeHTML(t('cta.select')) + '</a>';

      return '' +
      '<article class="group relative flex flex-col gap-4 rounded-2xl border border-sand-300 bg-white p-4 transition hover:border-mist-300 hover:shadow-card sm:flex-row sm:items-center sm:gap-5 sm:p-5' + (closed ? ' opacity-70' : '') + '">' +
        '<div class="relative h-28 w-full shrink-0 overflow-hidden rounded-xl sm:h-24 sm:w-32">' +
          '<div class="ph ph-' + (tr ? tr.ph : 'reef') + ' absolute inset-0">' +
            (tr ? photo(photoPath.trip(tr.slug), tr.title) : '') +
          '</div>' +
        '</div>' +
        '<div class="min-w-0 flex-1">' +
          '<div class="flex flex-wrap items-center gap-2">' +
            '<span class="inline-flex items-center gap-1.5 rounded-full bg-flame px-2.5 py-1 text-[11px] font-mark font-medium uppercase tracking-[0.12em] text-white">' +
              escapeHTML(t('lbl.sharing')) + '</span>' +
            '<span class="font-mark text-[11px] uppercase tracking-[0.14em] text-mist-700">' + escapeHTML(d.id) + '</span>' +
          '</div>' +
          '<h3 class="mt-2 font-display text-lg text-ink-700">' +
            (closed ? escapeHTML(tr ? tr.title : '—')
              : '<a href="' + href('departure.html', { id: d.id }) + '" class="hover:text-flame-600">' + escapeHTML(tr ? tr.title : '—') + '</a>') +
          '</h3>' +
          '<p class="mt-1.5 flex items-center gap-1.5 text-sm text-ink/70">' +
            '<span class="icon icon-boat-mast h-3.5 w-3.5 shrink-0 text-mist-700" aria-hidden="true"></span>' +
            escapeHTML(b ? b.name : '—') +
          '</p>' +
          (boards ? '<p class="mt-1 flex items-center gap-1.5 text-sm text-ink/70">' +
            '<span class="icon icon-map-pin h-3.5 w-3.5 shrink-0 text-mist-700" aria-hidden="true"></span>' +
            escapeHTML(disembarks && disembarks !== boards ? 'Boards ' + boards + ' · Disembarks ' + disembarks : 'Round trip from ' + boards) +
          '</p>' : '') +
          '<div class="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink/70">' +
            metaRow([fmt.dateRange(d.start, d.nights), fmt.nights(d.nights), w ? w.short : null]) +
          '</div>' +
          '<p class="mt-1.5 text-sm font-medium ' + (urgent ? 'text-flame-600' : 'text-ink/60') + '">' + escapeHTML(availability) + '</p>' +
          (tr && !o.hideCta ? '<a href="' + href('trip.html', { slug: tr.slug }) + '" class="mt-2 inline-flex items-center gap-1 font-mark text-[11px] uppercase tracking-[0.14em] text-flame-600 underline underline-offset-4">' +
            escapeHTML(t('cta.details')) +
            '<span class="icon icon-chevron-right h-3 w-3" aria-hidden="true"></span>' +
          '</a>' : '') +
        '</div>' +
        '<div class="flex items-center justify-between gap-4 border-t border-sand-200 pt-4 sm:flex-col sm:items-end sm:border-0 sm:pt-0 sm:text-right">' +
          '<div>' +
            '<div class="font-mark text-[11px] uppercase tracking-[0.16em] text-mist-700">' + escapeHTML(t('lbl.from')) + '</div>' +
            fmt.priceTag(d.price, 'font-display text-xl text-deep-700') +
            '<div class="text-xs text-ink/50">' + escapeHTML(t('lbl.pp')) + '</div>' +
          '</div>' +
          (o.hideCta ? '' : cta) +
        '</div>' +
      '</article>';
    },

    /** Discovery card — boat. */
    boat(b) {
      return '' +
      '<a href="' + href('boat.html', { slug: b.slug }) + '" class="group block focus-ring-mist">' +
        '<div class="relative aspect-[3/2] overflow-hidden rounded-2xl bg-ink">' +
          '<div class="ph ph-' + b.ph + ' absolute inset-0 transition-transform duration-700 ease-swell group-hover:scale-[1.04]">' +
            photo(photoPath.boat(b.slug), b.name) +
          '</div>' +
          '<div class="scrim-soft absolute inset-0"></div>' +
          '<div class="absolute inset-x-4 bottom-4">' +
            '<div class="font-mark text-[11px] uppercase tracking-[0.18em] text-white/80">' + escapeHTML(b.type) + '</div>' +
            '<div class="mt-1 font-display text-2xl text-white">' + escapeHTML(b.name) + '</div>' +
          '</div>' +
        '</div>' +
        '<p class="mt-4 text-sm leading-relaxed text-ink/75">' + escapeHTML(b.tagline) + '</p>' +
        '<dl class="mt-4 grid grid-cols-4 gap-2 border-t border-sand-300 pt-3 text-center">' +
          [['Length', b.length], ['Guests', b.guests], ['Cabins', b.cabins], ['Crew', b.crew]].map((r) =>
            '<div><dt class="font-mark text-[10px] uppercase tracking-[0.14em] text-mist-700">' + escapeHTML(r[0]) +
            '</dt><dd class="mt-0.5 font-display text-base text-ink-700">' + escapeHTML(r[1]) + '</dd></div>').join('') +
        '</dl>' +
      '</a>';
    },

    /** Discovery card — destination, framed in the logo's arch. */
    water(w) {
      return '' +
      '<a href="' + href('destination.html', { slug: w.slug }) + '" class="group block focus-ring-mist">' +
        '<div class="relative aspect-[3/4] overflow-hidden bg-ink arch-soft">' +
          '<div class="ph ph-' + w.ph + ' absolute inset-0 transition-transform duration-700 ease-swell group-hover:scale-[1.05]">' +
            photo(photoPath.water(w.slug), w.name) +
          '</div>' +
          '<div class="scrim absolute inset-0"></div>' +
          '<div class="absolute inset-x-4 bottom-4 text-center">' +
            '<div class="font-mark text-[10px] uppercase tracking-[0.2em] text-white/75">' + escapeHTML(w.season) + '</div>' +
            '<h3 class="mt-1.5 font-display text-2xl leading-tight text-white">' + escapeHTML(w.short) + '</h3>' +
            '<p class="mt-2 line-clamp-2 text-xs leading-relaxed text-white/80">' + escapeHTML(w.blurb) + '</p>' +
          '</div>' +
        '</div>' +
        '<div class="mt-3 flex items-center justify-center gap-2 text-xs text-mist-700">' +
          metaRow([tripsInWater(w.slug).length + ' itineraries', 'From ' + escapeHTML(w.gateway)]) +
        '</div>' +
      '</a>';
    },

    /** Discovery card — journal article. */
    article(a, opts) {
      const o = opts || {};
      return '' +
      '<a href="' + href('article.html', { slug: a.slug }) + '" class="group block focus-ring-mist">' +
        '<div class="relative overflow-hidden rounded-2xl bg-ink ' + (o.tall ? 'aspect-[4/5]' : 'aspect-[16/10]') + '">' +
          '<div class="ph ph-' + a.ph + ' absolute inset-0 transition-transform duration-700 ease-swell group-hover:scale-[1.04]">' +
            photo(photoPath.article(a.slug), a.title) +
          '</div>' +
          '<div class="absolute left-3 top-3">' + chip(a.category) + '</div>' +
        '</div>' +
        '<div class="pt-4">' +
          '<h3 class="font-display text-xl leading-snug text-ink-700 group-hover:text-flame-600 transition-colors">' +
            escapeHTML(a.title) + '</h3>' +
          '<p class="mt-2 line-clamp-2 text-sm leading-relaxed text-ink/70">' + escapeHTML(a.dek) + '</p>' +
          '<div class="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-mist-700">' +
            metaRow([a.author, fmt.date(a.date), a.read + ' min read']) +
          '</div>' +
        '</div>' +
      '</a>';
    },

    /** Discovery card — experience tile. */
    experience(e) {
      return '' +
      '<a href="' + href('experience.html', { slug: e.slug }) + '" class="group relative block overflow-hidden rounded-2xl bg-ink focus-ring-mist">' +
        '<div class="ph ph-' + e.ph + ' absolute inset-0 transition-transform duration-700 ease-swell group-hover:scale-[1.05]">' +
          photo(photoPath.experience(e.slug), e.name) +
        '</div>' +
        '<div class="scrim absolute inset-0"></div>' +
        '<div class="relative flex aspect-[4/5] flex-col justify-end p-5 sm:aspect-[3/4] sm:p-6">' +
          '<span class="icon icon-exp-' + e.slug + ' mb-4 h-9 w-9 text-white/85" aria-hidden="true"></span>' +
          '<h3 class="font-display text-2xl leading-tight text-white">' + escapeHTML(e.name) + '</h3>' +
          '<p class="mt-1.5 font-mark text-[11px] uppercase tracking-[0.16em] text-white/70">' + escapeHTML(e.tagline) + '</p>' +
          '<p class="mt-3 line-clamp-3 text-sm leading-relaxed text-white/85">' + escapeHTML(e.blurb) + '</p>' +
          '<span class="mt-4 inline-flex items-center gap-2 font-mark text-[11px] uppercase tracking-[0.18em] text-white">' +
            escapeHTML(t('cta.explore')) +
            '<span class="icon icon-chevron-right h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true"></span></span>' +
        '</div>' +
      '</a>';
    },

    /** Commerce card — a selectable cabin. Selection is wired by the page. */
    cabin(c, ctx) {
      const o = ctx || {};
      const sold = c.left <= 0;
      return '' +
      '<div class="relative flex gap-4 rounded-2xl border p-4 transition ' +
        (sold ? 'border-sand-300 bg-sand/60 opacity-70' : 'border-sand-300 bg-white hover:border-mist-400') + '">' +
        '<div class="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl sm:h-28 sm:w-32">' +
          '<div class="ph ph-' + c.ph + ' absolute inset-0">' +
            (o.boatSlug ? photo(photoPath.cabin(o.boatSlug, c.code), c.name) : '') +
          '</div>' +
        '</div>' +
        '<div class="min-w-0 flex-1">' +
          '<div class="flex items-start justify-between gap-3">' +
            '<div>' +
              '<h4 class="font-display text-lg text-ink-700">' + escapeHTML(c.name) + '</h4>' +
              '<p class="mt-0.5 text-xs text-mist-700">' + escapeHTML(c.deck) + ' · ' + escapeHTML(c.beds) +
                ' · sleeps ' + escapeHTML(c.maxOccupancy) + '</p>' +
            '</div>' +
            '<div class="shrink-0 text-right">' +
              fmt.priceTag(c.price, 'font-display text-lg text-deep-700') +
              '<div class="text-[11px] text-ink/50">' + escapeHTML(t('lbl.pp')) + '</div>' +
            '</div>' +
          '</div>' +
          '<ul class="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-ink/65">' +
            (c.features || []).map((f) => '<li>' + escapeHTML(f) + '</li>').join('') +
          '</ul>' +
          '<p class="mt-2 font-mark text-[11px] uppercase tracking-[0.14em] ' +
            (sold ? 'text-ink/40' : c.left <= 1 ? 'text-flame-600' : 'text-mist-700') + '">' +
            (sold ? 'Fully booked' : c.left === 1 ? 'Last cabin' : c.left + ' cabins left') + '</p>' +
        '</div>' +
      '</div>';
    },
  };

  /* --- runtime states ----------------------------------------------------- */
  const states = {
    /** Skeleton in the same box as the real card — no layout shift on swap. */
    skeleton(kind, n) {
      const one = {
        trip: '<div><div class="skeleton aspect-[4/3] rounded-2xl"></div>' +
          '<div class="skeleton mt-4 h-5 w-3/4"></div><div class="skeleton mt-2 h-3.5 w-full"></div>' +
          '<div class="skeleton mt-1.5 h-3.5 w-2/3"></div><div class="skeleton mt-4 h-4 w-1/3"></div></div>',
        departure: '<div class="rounded-2xl border border-sand-300 p-4 sm:p-5">' +
          '<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">' +
          '<div class="skeleton h-28 w-full rounded-xl sm:h-24 sm:w-32"></div>' +
          '<div class="flex-1"><div class="skeleton h-4 w-28"></div><div class="skeleton mt-3 h-5 w-2/3"></div>' +
          '<div class="skeleton mt-2.5 h-3.5 w-3/4"></div></div>' +
          '<div class="skeleton h-11 w-full rounded-full sm:w-40"></div></div></div>',
        boat: '<div><div class="skeleton aspect-[3/2] rounded-2xl"></div>' +
          '<div class="skeleton mt-4 h-3.5 w-full"></div><div class="skeleton mt-4 h-12 w-full"></div></div>',
        water: '<div><div class="skeleton aspect-[3/4] arch-soft"></div>' +
          '<div class="skeleton mx-auto mt-3 h-3.5 w-2/3"></div></div>',
        article: '<div><div class="skeleton aspect-[16/10] rounded-2xl"></div>' +
          '<div class="skeleton mt-4 h-5 w-4/5"></div><div class="skeleton mt-2 h-3.5 w-full"></div>' +
          '<div class="skeleton mt-3 h-3 w-1/2"></div></div>',
        cabin: '<div class="flex gap-4 rounded-2xl border border-sand-300 p-4">' +
          '<div class="skeleton h-24 w-24 rounded-xl sm:h-28 sm:w-32"></div>' +
          '<div class="flex-1"><div class="skeleton h-5 w-1/2"></div>' +
          '<div class="skeleton mt-2 h-3.5 w-2/3"></div><div class="skeleton mt-3 h-3.5 w-1/3"></div></div></div>',
      }[kind] || '<div class="skeleton h-40 rounded-2xl"></div>';
      let out = '';
      for (let i = 0; i < (n || 3); i++) out += one;
      return '<div class="contents" aria-hidden="true">' + out + '</div>';
    },

    /* Alpine does not initialise directives inside x-html output, so the
       buttons below dispatch a native bubbling event instead. Listen for it on
       the Alpine root that owns the list:
           <section x-data="…" @sf-reset="reset()" @sf-retry="load()">
       ------------------------------------------------------------------- */

    /** Empty result — always offers a way out. */
    empty(opts) {
      const o = opts || {};
      const dispatch = 'onclick="this.dispatchEvent(new CustomEvent(\'sf-reset\',{bubbles:true}))"';
      return '' +
      '<div class="col-span-full flex flex-col items-center justify-center rounded-3xl border border-dashed ' +
        'border-mist-300 bg-sand/70 px-6 py-14 text-center">' +
        '<span class="icon icon-empty-state mx-auto h-12 w-12 text-mist-400" aria-hidden="true"></span>' +
        '<h3 class="mt-5 font-display text-xl text-ink-700">' + escapeHTML(o.title || 'No matches — yet') + '</h3>' +
        '<p class="mt-2 max-w-sm text-sm leading-relaxed text-ink/70">' +
          escapeHTML(o.body || 'Nothing fits every filter at once. Widen one of them, or let us suggest something — a lot of our best weeks never make it onto a search page.') + '</p>' +
        '<div class="mt-6 flex flex-wrap items-center justify-center gap-3">' +
          (o.onReset
            ? '<button type="button" ' + dispatch + ' class="inline-flex h-11 items-center rounded-full bg-ink px-5 font-mark text-sm uppercase tracking-[0.12em] text-white transition hover:bg-ink-600">' +
              escapeHTML(o.resetLabel || 'Clear filters') + '</button>'
            : '') +
          '<a href="' + (o.altHref || 'contact.html') + '" class="inline-flex h-11 items-center rounded-full border border-ink/20 px-5 font-mark text-sm uppercase tracking-[0.12em] text-ink-700 transition hover:border-ink hover:bg-ink hover:text-white">' +
            escapeHTML(o.altLabel || t('cta.help')) + '</a>' +
        '</div>' +
      '</div>';
    },

    /** Error — never shows the raw message, always offers retry. */
    error(opts) {
      const o = opts || {};
      const dispatch = 'onclick="this.dispatchEvent(new CustomEvent(\'sf-retry\',{bubbles:true}))"';
      return '' +
      '<div class="col-span-full flex flex-col items-center justify-center rounded-3xl border border-flame/25 ' +
        'bg-flame/5 px-6 py-14 text-center" role="alert">' +
        '<span class="icon icon-warning-triangle h-12 w-12 text-flame" aria-hidden="true"></span>' +
        '<h3 class="mt-5 font-display text-xl text-ink-700">' + escapeHTML(o.title || t('sys.error')) + '</h3>' +
        '<p class="mt-2 max-w-sm text-sm leading-relaxed text-ink/70">' +
          escapeHTML(o.body || 'The connection dropped on the way to our schedule service. Nothing is wrong with your booking — try again, and if it keeps happening the office answers on WhatsApp.') + '</p>' +
        '<div class="mt-6 flex flex-wrap items-center justify-center gap-3">' +
          (o.onRetry
            ? '<button type="button" ' + dispatch + ' class="inline-flex h-11 items-center gap-2 rounded-full bg-flame px-5 font-mark text-sm uppercase tracking-[0.12em] text-white transition hover:bg-flame-600">' +
              '<span class="icon icon-refresh h-4 w-4" aria-hidden="true"></span>' + escapeHTML(t('cta.retry')) + '</button>'
            : '') +
          '<a href="contact.html" class="inline-flex h-11 items-center rounded-full border border-ink/20 px-5 font-mark text-sm uppercase tracking-[0.12em] text-ink-700 transition hover:border-ink hover:bg-ink hover:text-white">' +
            escapeHTML(t('cta.help')) + '</a>' +
        '</div>' +
      '</div>';
    },
  };

  /* ==========================================================================
     12. In-place re-formatting after a currency / language switch
     ======================================================================== */
  /* Writes are guarded by an equality check. layout.js watches the DOM with a
     MutationObserver to catch late-rendered cards, so an unconditional write
     here would re-trigger that observer forever. */
  function setText(el, value) {
    if (el.textContent !== value) el.textContent = value;
  }

  function hydrate(root) {
    const scope = root || document;
    scope.querySelectorAll('[data-usd]').forEach((el) => {
      const raw = el.getAttribute('data-usd');
      setText(el, raw === '' ? fmt.money(null) : fmt.money(Number(raw)));
    });
    scope.querySelectorAll('[data-i18n]').forEach((el) => {
      setText(el, t(el.getAttribute('data-i18n')));
    });
    scope.querySelectorAll('[data-i18n-aria]').forEach((el) => {
      el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria')));
    });
    scope.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')));
    });
  }

  /* ==========================================================================
     Public surface
     ======================================================================== */
  return {
    // content
    experiences, waters, boats, trips, departures, articles, team, faq,
    lengths, parties, CURRENCIES, inclusions,
    // lookups
    water: byWater, boat: byBoat, trip: byTrip, experience: byExperience,
    article: byArticle, departure: byDeparture, person: byPerson,
    tripsOnBoat, tripsInWater, departuresFor, departuresOnBoat, departureMonths,
    filterTrips, filterDepartures, lengthOf, routeFor, bodyFor, search,
    // utilities
    fmt, t, store, query, href, forcedState, load, emptied, addDays, parseISO,
    escapeHTML, badge, chip, metaRow, cards, states, hydrate, photoPath,
  };
})();
