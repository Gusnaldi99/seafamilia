/* ============================================================================
   Sea Familia — chrome behaviour
   ----------------------------------------------------------------------------
   The header, footer and floating help button are STATIC HTML in every page.
   Their canonical source is partials/, written into each page between marker
   comments by tools/sync-partials.js. This file holds only behaviour:

     window.seaChrome()      header: search panel, mobile drawer, sign-in,
                             currency + language switching
     window.seaNewsletter()  footer: the familia letter form
     SEA.toast({ … })        global toast host
     SEA.closeChrome()       release the scroll lock

   plus the one-time currency/language hydration pass and the observer that
   catches cards Alpine renders later.

   Page contract:
     <main id="main">                     … required, target of the skip link
     <!-- sea:header … --> … <!-- /sea:header -->   … written by sync-partials
     <!-- sea:footer … --> … <!-- /sea:footer -->   … written by sync-partials
     <body data-page="departures">        … build-time: which nav item lights up
     <body data-sticky-bar>               … build-time: omit the floating help
                                            button (funnels own the bottom edge)

   Load order: this is a classic script at the end of <body>, so it runs before
   the deferred Alpine bundle boots. That matters because seaChrome() and
   seaNewsletter() must exist by the time Alpine initialises the static markup.
   ========================================================================== */
(function () {
  'use strict';

  const esc = SEA.escapeHTML;

  /* Icons are still built here because SEA.toast() and the search results are
     rendered from JS. The chrome's own icons are inline in partials/. Shapes
     live in assets/media/icons/*.svg, referenced via the .icon-* mask classes
     in app.css — this just resolves a couple of JS-only short names to the
     shared shape's canonical class, so call sites below don't need to change. */
  const ICON_ALIAS = { close: 'cross', arrow: 'chevron-right' };
  const icon = (name, cls) =>
    '<span class="icon icon-' + (ICON_ALIAS[name] || name) + ' ' + (cls || 'h-5 w-5') + '" aria-hidden="true"></span>';

  /* ==========================================================================
     Header — search, drawer, sign-in, currency, language
     Mounted on the wrapper div in partials/header.html.
     ======================================================================== */
  window.seaChrome = function () {
    return {
      open: null,
      term: '',
      results: { trips: [], waters: [], boats: [], articles: [], total: 0 },
      currency: SEA.store.currency,
      lang: SEA.store.lang,
      signin: { email: '', error: '', busy: false, sent: false },

      toggle(which) {
        this.open = this.open === which ? null : which;
        document.documentElement.style.overflow =
          (this.open === 'menu' || this.open === 'signin') ? 'hidden' : '';
        if (this.open === 'search') this.$nextTick(() => this.$refs.searchInput && this.$refs.searchInput.focus());
        if (this.open === 'signin') this.$nextTick(() => this.$refs.signinEmail && this.$refs.signinEmail.focus());
      },
      closeAll() {
        this.open = null;
        document.documentElement.style.overflow = '';
      },

      runSearch() { this.results = SEA.search(this.term); },

      resultsHTML() {
        const r = this.results;
        const sec = (label, items, render) => !items.length ? '' :
          '<div class="mb-6"><p class="font-mark text-[11px] uppercase tracking-[0.18em] text-mist-700">' +
          label + '</p><ul class="mt-2 divide-y divide-sand-200">' + items.map(render).join('') + '</ul></div>';
        const row = (href, ph, photoSrc, title, meta) =>
          '<li><a href="' + href + '" class="flex items-center gap-4 py-3 transition hover:bg-sand/60">' +
            '<span class="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg">' +
              '<span class="ph ph-' + ph + ' absolute inset-0 block">' +
                '<img class="img-slot" src="' + photoSrc + '" alt="" loading="lazy" onerror="this.style.display=\'none\'">' +
              '</span></span>' +
            '<span class="min-w-0 flex-1"><span class="block font-display text-base text-ink-700">' + esc(title) + '</span>' +
            '<span class="block truncate text-xs text-mist-700">' + esc(meta) + '</span></span>' +
            '<span class="text-mist-400">' + icon('arrow', 'h-4 w-4') + '</span></a></li>';

        return '' +
          sec('Itineraries', r.trips, (x) => row(SEA.href('trip.html', { slug: x.slug }), x.ph, SEA.photoPath.trip(x.slug), x.title,
            (SEA.water(x.water) || {}).short + ' · ' + SEA.fmt.nights(x.nights) + ' · from ' + SEA.fmt.money(x.from))) +
          sec('Waters', r.waters, (x) => row(SEA.href('destination.html', { slug: x.slug }), x.ph, SEA.photoPath.water(x.slug), x.name,
            x.season + ' · from ' + x.gateway)) +
          sec('Boats', r.boats, (x) => row(SEA.href('boat.html', { slug: x.slug }), x.ph, SEA.photoPath.boat(x.slug), x.name,
            x.type + ' · ' + x.guests + ' guests · ' + x.cabins + ' cabins')) +
          sec('Journal', r.articles, (x) => row(SEA.href('article.html', { slug: x.slug }), x.ph, SEA.photoPath.article(x.slug), x.title,
            x.category + ' · ' + x.read + ' min read'));
      },

      setCurrency(v) {
        SEA.store.currency = v;
        this.currency = v;
        SEA.hydrate(document);
        window.dispatchEvent(new CustomEvent('sea:currency', { detail: v }));
        SEA.toast({
          title: 'Prices now in ' + v,
          body: 'Converted at our weekly rate. Your invoice is issued in the currency you choose at checkout.',
          variant: 'info',
        });
      },
      setLang(v) {
        SEA.store.lang = v;
        this.lang = v;
        document.documentElement.setAttribute('lang', v);
        SEA.hydrate(document);
        window.dispatchEvent(new CustomEvent('sea:lang', { detail: v }));
      },

      submitSignin() {
        const email = (this.signin.email || '').trim();
        this.signin.error = '';
        if (!email) { this.signin.error = 'Please enter the email address you booked with.'; return; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
          this.signin.error = 'That address is missing something — check for a typo.'; return;
        }
        this.signin.busy = true;
        setTimeout(() => { this.signin.busy = false; this.signin.sent = true; }, 700);
      },
    };
  };

  /* ==========================================================================
     Footer — the familia letter
     ======================================================================== */
  window.seaNewsletter = function () {
    return {
      email: '', error: '', busy: false, sent: false,
      submit() {
        const v = (this.email || '').trim();
        this.error = '';
        if (!v) { this.error = 'An email address, and that is all we need.'; return; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) { this.error = 'That address does not look complete.'; return; }
        this.busy = true;
        setTimeout(() => {
          this.busy = false; this.sent = true;
          SEA.toast({ title: 'You are on the list', body: 'One letter a month, and nothing in between.', variant: 'success' });
        }, 650);
      },
    };
  };

  /* ==========================================================================
     Toast host — announced to assistive tech, dismissible, auto-expiring
     ======================================================================== */
  const TOAST_VARIANT = {
    success: { ring: 'ring-mist-300', bar: 'bg-ink', icon: 'check', iconCls: 'bg-mist-100 text-ink-700' },
    error: { ring: 'ring-flame/30', bar: 'bg-flame', icon: 'close', iconCls: 'bg-flame/10 text-flame-600' },
    info: { ring: 'ring-sand-300', bar: 'bg-mist', icon: 'globe', iconCls: 'bg-sand-200 text-ink-700' },
  };

  function ensureToastHost() {
    let host = document.getElementById('sf-toasts');
    if (!host) {
      host = document.createElement('div');
      host.id = 'sf-toasts';
      host.className = 'no-print pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex flex-col items-center ' +
        'gap-3 px-4 pb-4 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:items-end sm:px-0 sm:pb-0';
      host.setAttribute('aria-live', 'polite');
      host.setAttribute('aria-atomic', 'false');
      document.body.appendChild(host);
    }
    return host;
  }

  SEA.toast = function (opts) {
    const o = opts || {};
    const v = TOAST_VARIANT[o.variant] || TOAST_VARIANT.success;
    const host = ensureToastHost();
    const el = document.createElement('div');
    el.className = 'pointer-events-auto w-full max-w-sm animate-toast-in overflow-hidden rounded-2xl bg-white ' +
      'shadow-lift ring-1 ' + v.ring;
    el.innerHTML =
      '<div class="flex items-start gap-3 p-4">' +
        '<span class="grid h-9 w-9 shrink-0 place-items-center rounded-full ' + v.iconCls + '">' +
          icon(v.icon, 'h-4 w-4') + '</span>' +
        '<div class="min-w-0 flex-1">' +
          '<p class="font-display text-base leading-snug text-ink-700">' + esc(o.title || '') + '</p>' +
          (o.body ? '<p class="mt-1 text-sm leading-relaxed text-ink/70">' + esc(o.body) + '</p>' : '') +
          (o.action ? '<a href="' + o.action.href + '" class="mt-2.5 inline-flex items-center gap-1.5 font-mark ' +
            'text-[11px] uppercase tracking-[0.16em] text-flame-600 underline underline-offset-4">' +
            esc(o.action.label) + '</a>' : '') +
        '</div>' +
        '<button type="button" aria-label="Dismiss" class="grid h-8 w-8 shrink-0 place-items-center rounded-full ' +
          'text-ink/40 transition hover:bg-sand">' + icon('close', 'h-4 w-4') + '</button>' +
      '</div>' +
      '<div class="h-0.5 w-full ' + v.bar + ' opacity-25"></div>';

    const kill = () => {
      el.style.transition = 'opacity .2s ease, transform .2s ease';
      el.style.opacity = '0';
      el.style.transform = 'translateY(8px)';
      setTimeout(() => el.remove(), 220);
    };
    el.querySelector('button').addEventListener('click', kill);
    host.appendChild(el);
    if (o.timeout !== 0) setTimeout(kill, o.timeout || 6000);
    return kill;
  };

  SEA.closeChrome = function () {
    document.documentElement.style.overflow = '';
  };

  /* ==========================================================================
     Sticky header — compact once the page has scrolled past the utility bar.
     Plain JS rather than Alpine state, so it works even if Alpine is slow, and
     so the header behaves identically on funnel screens.
     ======================================================================== */
  const headerEl = document.querySelector('header.sticky');
  if (headerEl) {
    let queued = false;
    const applyCompact = () => {
      queued = false;
      headerEl.dataset.compact = window.scrollY > 72 ? 'true' : 'false';
    };
    applyCompact();
    window.addEventListener('scroll', () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(applyCompact);
    }, { passive: true });
  }

  /* ==========================================================================
     Reveal on scroll — a fade and a 16px rise, once, per <section>.
     The hidden state is only ever applied from here, so no-JS and
     reduced-motion visitors see plain, fully visible content.
     Funnel screens opt out: their steps already animate via x-transition, and
     stacking the two reads as a stutter.
     ======================================================================== */
  const prefersReduced = window.matchMedia
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealEnabled = !prefersReduced
    && !document.body.hasAttribute('data-sticky-bar')
    && 'IntersectionObserver' in window;

  let revealObserver = null;

  function armReveals(root) {
    if (!revealEnabled) return;
    if (!revealObserver) {
      revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        });
      }, { rootMargin: '0px 0px -10% 0px', threshold: 0.04 });
    }

    (root || document).querySelectorAll('main section:not([data-reveal])').forEach((el) => {
      el.setAttribute('data-reveal', '');
      // Already on screen: mark visible in the same tick. Style is resolved once
      // the script yields, so this never flashes and never animates.
      if (el.getBoundingClientRect().top < window.innerHeight * 0.92) {
        el.classList.add('is-visible');
        return;
      }
      revealObserver.observe(el);
    });
  }

  armReveals(document);

  /* ==========================================================================
     Currency + language hydration
     The static markup ships English labels and integer USD in data-usd. This
     pass rewrites both from the stored preference, then keeps watching: Alpine
     renders cards after this script runs, and x-html output arrives later still.
     One debounced observer covers both. SEA.hydrate() compares before writing,
     which is what stops the observer from looping on its own mutations.
     ======================================================================== */
  document.documentElement.setAttribute('lang', SEA.store.lang);
  SEA.hydrate(document);

  let pending = null;
  const observer = new MutationObserver(() => {
    if (pending) return;
    pending = requestAnimationFrame(() => {
      pending = null;
      SEA.hydrate(document);
      // Detail pages render their whole body inside <template x-if>, so their
      // sections arrive after this script has run. Arm them when they appear.
      armReveals(document);
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();
