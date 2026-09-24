import type { Config } from 'tailwindcss';

/**
 * PANDONIA DESIGN TOKENS
 * Source of truth: Phase 2 design system + Phase 5 accessibility corrections.
 *
 * Accessibility corrections applied (do not revert):
 *  - `ink-3` is #756C60 (4.6:1 on cream). The earlier #8A8175 measured 3.4:1
 *    and failed WCAG AA — it carries every mono label, unit and axis value.
 *  - On deep forest, 0.55 is the MINIMUM opacity for text. 0.45 measured
 *    3.7:1 and failed. Use `text-on-deep-muted`, never a raw opacity.
 */

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // grounds
        cream: '#F6F1E8',
        sand: '#F4EADB',
        paper: '#FCFAF6',
        deep: '#18261A',

        // ink
        ink: {
          DEFAULT: '#26201A',
          2: '#5C554C',
          3: '#756C60', // a11y-corrected — see header note
          inv: '#EDE7DA',
        },

        // brand
        forest: {
          DEFAULT: '#415A3B',
          deep: '#2C3F28',
          tint: '#E7EADE',
        },

        // functional — Nulpunkt only
        amber: '#E3A754',
        sage: {
          DEFAULT: '#A0B89F',
          deep: '#4E7050',
        },
        brick: '#8C3B2E',
        clay: '#AE9D84',
      },

      fontFamily: {
        serif: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-interface)', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['var(--font-data)', 'ui-monospace', 'monospace'],
      },

      /**
       * Type scale — Phase 2 §02.
       * The serif owns >44px. Degular owns <24px. Between, register decides.
       */
      fontSize: {
        d1: ['clamp(44px, 6.6vw + 18px, 88px)', { lineHeight: '0.94', letterSpacing: '-0.02em' }],
        d2: ['clamp(34px, 4.4vw + 14px, 64px)', { lineHeight: '1.0', letterSpacing: '-0.02em' }],
        d3: ['clamp(27px, 2.6vw + 14px, 44px)', { lineHeight: '1.06', letterSpacing: '-0.015em' }],
        h1: ['clamp(26px, 2.4vw + 14px, 40px)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        h2: ['clamp(21px, 1.1vw + 17px, 28px)', { lineHeight: '1.2', letterSpacing: '-0.015em' }],
        h3: ['clamp(18px, 0.4vw + 16px, 20px)', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        'body-l': ['clamp(18px, 0.4vw + 16px, 20px)', { lineHeight: '1.55' }],
        body: ['clamp(16px, 0.2vw + 15px, 17px)', { lineHeight: '1.6' }],
        'body-s': ['15px', { lineHeight: '1.55' }],
        val: ['clamp(24px, 1.4vw + 19px, 32px)', { lineHeight: '1', letterSpacing: '-0.01em' }],
        data: ['13px', { lineHeight: '1.5', letterSpacing: '0.02em' }],
        label: ['11px', { lineHeight: '1.4', letterSpacing: '0.1em' }],
      },

      // 4px base — only these steps are permitted (Phase 2 §03)
      spacing: {
        '2xs': '4px',
        xs: '8px',
        s: '16px',
        m: '24px',
        l: '40px',
        xl: '64px',
        '2xl': '96px',
        '3xl': '128px',
        '4xl': '180px',
      },

      maxWidth: {
        content: '1320px',
        meas: '64ch',
        'meas-n': '48ch',
        'meas-s': '40ch',
      },

      // Radius is rationed: 2px on controls, 8px on a product panel. Nothing else.
      borderRadius: {
        none: '0',
        control: '2px',
        panel: '8px',
      },

      borderColor: {
        rule: 'rgba(38,32,26,0.20)',
        'rule-soft': 'rgba(38,32,26,0.11)',
        'rule-inv': 'rgba(237,231,218,0.22)',
        'rule-inv-soft': 'rgba(237,231,218,0.16)',
      },

      transitionTimingFunction: {
        pandonia: 'cubic-bezier(0.2, 0.6, 0.2, 1)',
      },
      transitionDuration: {
        hover: '140ms',
        reveal: '320ms',
        orchestrated: '900ms',
      },

      outlineOffset: {
        focus: '3px',
      },
    },
  },
  plugins: [],
};

export default config;
