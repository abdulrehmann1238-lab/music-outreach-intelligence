/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'xs': '480px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1600px',
    },
    extend: {
      colors: {
        'bg': 'var(--bg)',
        'surface': 'var(--surface)',
        'surface-elevated': 'var(--surface-elevated)',
        'surface-sunken': 'var(--surface-sunken)',
        'ink': 'var(--ink)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',
        'border': 'var(--border)',
        'border-strong': 'var(--border-strong)',
        'primary': {
          DEFAULT: 'var(--primary)',
          hover: 'var(--primary-hover)',
          active: 'var(--primary-active)',
          tint: 'var(--primary-tint)',
        },
        'secondary': {
          DEFAULT: 'var(--secondary)',
          tint: 'var(--secondary-tint)',
        },
        'accent': {
          DEFAULT: 'var(--accent)',
          hover: 'var(--accent-hover)',
          tint: 'var(--accent-tint)',
        },
        'success': {
          DEFAULT: 'var(--success)',
          tint: 'var(--success-tint)',
        },
        'warning': {
          DEFAULT: 'var(--warning)',
          tint: 'var(--warning-tint)',
        },
        'error': {
          DEFAULT: 'var(--error)',
          tint: 'var(--error-tint)',
        },
        'info': {
          DEFAULT: 'var(--info)',
          tint: 'var(--info-tint)',
        },
      },
      borderRadius: {
        'xs': 'var(--r-xs)',
        'sm': 'var(--r-sm)',
        'md': 'var(--r-md)',
        'lg': 'var(--r-lg)',
        'xl': 'var(--r-xl)',
        'full': 'var(--r-full)',
      },
      boxShadow: {
        '1': 'var(--shadow-1)',
        '2': 'var(--shadow-2)',
        '3': 'var(--shadow-3)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Newsreader', 'Georgia', 'serif'],
        sans: ['var(--font-ui)', 'Instrument Sans', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      zIndex: {
        'base': 'var(--z-base)',
        'sticky': 'var(--z-sticky)',
        'nav': 'var(--z-nav)',
        'drawer': 'var(--z-drawer)',
        'modal': 'var(--z-modal)',
        'popover': 'var(--z-popover)',
        'toast': 'var(--z-toast)',
        'loader': 'var(--z-loader)',
      }
    },
  },
  plugins: [],
}
