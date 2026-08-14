/* ============================================================================
   Sea Familia — Tailwind design tokens
   Compiled by the CLI, not the browser:

     npm run css          build once  → assets/css/tailwind.css
     npm run css:watch    rebuild on save
     npm run css:min      minified    → assets/css/tailwind.min.css

   Brand palette (fixed):
     #780000  deep    — deep hull red: quiet headings, footer wash
     #C1121F  flame   — primary action / accent
     #FFFFFF  white   — page ground
     #003049  ink     — primary text, dark sections
     #669BBC  mist    — secondary, water, quiet UI
   Brand neutral (sampled from assets/logo/logo-light.png):
     #F7F5F2  sand    — warm paper tone for alternating sections
   Every numbered step below is a tint/shade of those six values — no new hues.
   ========================================================================== */
module.exports = {
  /* The scanner only sees literal text, so every file that CONTAINS a class name
     has to be listed. Two of them are JavaScript: the card renderers in data.js
     and the toast/icon markup in layout.js are template strings. Miss those and
     the cards compile with no styling at all.

     Deliberately a file list rather than 'assets/js/**' — assets/js/vendor/
     holds the Alpine bundle, which has no Tailwind classes and would only add
     noise (and build time) to the scan. */
  content: [
    './*.html',
    './partials/*.html',
    './assets/js/data.js',
    './assets/js/layout.js',
  ],

  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#003049',
          950: '#00131E',
          900: '#001C2B',
          800: '#00243A',
          700: '#003049',
          600: '#0A4363',
          500: '#15577D',
        },
        deep: {
          DEFAULT: '#780000',
          900: '#4A0000',
          800: '#5C0000',
          700: '#780000',
          600: '#941212',
        },
        flame: {
          DEFAULT: '#C1121F',
          700: '#960D18',
          600: '#A50E1A',
          500: '#C1121F',
          400: '#D53C46',
          300: '#E4737A',
        },
        mist: {
          DEFAULT: '#669BBC',
          700: '#40708C',
          600: '#53869F',
          500: '#669BBC',
          400: '#87B1CA',
          300: '#A8C7D8',
          200: '#C6DBE7',
          100: '#E1EBF2',
          50: '#F1F6F9',
        },
        sand: {
          DEFAULT: '#F7F5F2',
          200: '#EFEBE5',
          300: '#E3DDD4',
        },
      },
      fontFamily: {
        // Editorial voice — long-form headlines, story pages
        display: ['Fraunces', 'Georgia', 'Cambria', 'serif'],
        // Wordmark voice — nav, eyebrows, buttons, data labels (echoes the logo)
        mark: ['Jost', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        // Reading voice — body copy, forms, tables
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        eyebrow: ['0.6875rem', { lineHeight: '1', letterSpacing: '0.22em' }],
      },
      maxWidth: {
        '8xl': '88rem',
        prose: '68ch',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.75rem',
      },
      boxShadow: {
        card: '0 1px 2px rgba(0,48,73,.05), 0 10px 28px -14px rgba(0,48,73,.22)',
        lift: '0 2px 6px rgba(0,48,73,.06), 0 26px 60px -22px rgba(0,48,73,.38)',
        rail: '0 -8px 28px -16px rgba(0,48,73,.30)',
      },
      transitionTimingFunction: {
        swell: 'cubic-bezier(.22,1,.36,1)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        'toast-in': {
          '0%': { opacity: '0', transform: 'translateY(14px) scale(.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'sheet-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        drift: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        'fade-up': 'fade-up .6s cubic-bezier(.22,1,.36,1) both',
        'fade-in': 'fade-in .4s ease both',
        'toast-in': 'toast-in .35s cubic-bezier(.22,1,.36,1) both',
        'sheet-up': 'sheet-up .3s cubic-bezier(.22,1,.36,1) both',
        drift: 'drift 7s ease-in-out infinite',
      },
      typography: (theme) => ({
        familia: {
          css: {
            '--tw-prose-body': theme('colors.ink.600'),
            '--tw-prose-headings': theme('colors.ink.700'),
            '--tw-prose-links': theme('colors.flame.600'),
            '--tw-prose-bold': theme('colors.ink.800'),
            '--tw-prose-quotes': theme('colors.deep.700'),
            '--tw-prose-quote-borders': theme('colors.flame.500'),
            '--tw-prose-counters': theme('colors.mist.DEFAULT'),
            '--tw-prose-bullets': theme('colors.mist.300'),
            '--tw-prose-hr': theme('colors.sand.300'),
            '--tw-prose-captions': theme('colors.mist.700'),
          },
        },
      }),
    },
  },

  /* The Play CDN loaded these via ?plugins=forms,typography. forms restyles
     inputs through base styles (no class needed); typography provides `prose`
     and the `prose-familia` variant configured above. */
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
