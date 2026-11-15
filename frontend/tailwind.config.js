/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1.5rem',
      screens: {
        '2xl': '1200px',
      },
    },
    extend: {
      colors: {
        orange: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FF6600',  // KTM bright electric racing orange
          500: '#FF5500',  // KTM signature racing orange
          600: '#E64A00',
          700: '#C23D00',
          800: '#9A3412',
          900: '#7C2D12',
        },
        ktm: {
          DEFAULT: '#FF5500',
          bright: '#FF6600',
          soft: 'rgba(255, 85, 0, 0.15)',
          glow: 'rgba(255, 85, 0, 0.45)',
        },
        bg: 'var(--bg)',
        surface: {
          1: 'var(--surface-1)',
          2: 'var(--surface-2)',
          3: 'var(--surface-3)',
        },
        border: {
          DEFAULT: 'var(--border)',
          strong: 'var(--border-strong)',
        },
        text: {
          DEFAULT: 'var(--text)',
          muted: 'var(--text-muted)',
          subtle: 'var(--text-subtle)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          hover: 'var(--accent-hover)',
          ink: 'var(--accent-ink)',
          soft: 'var(--accent-soft)',
          ring: 'var(--accent-ring)',
        },
        danger: {
          DEFAULT: 'var(--danger)',
          soft: 'var(--danger-soft)',
        },
        warning: {
          DEFAULT: 'var(--warning)',
          soft: 'var(--warning-soft)',
        },
        info: {
          DEFAULT: 'var(--info)',
          soft: 'var(--info-soft)',
        },
        // Shadcn UI compatibility mappings
        background: 'var(--bg)',
        foreground: 'var(--text)',
        card: {
          DEFAULT: 'var(--surface-1)',
          foreground: 'var(--text)',
        },
        popover: {
          DEFAULT: 'var(--surface-2)',
          foreground: 'var(--text)',
        },
        primary: {
          DEFAULT: 'var(--text)',
          foreground: 'var(--bg)',
        },
        secondary: {
          DEFAULT: 'var(--surface-2)',
          foreground: 'var(--text)',
        },
        muted: {
          DEFAULT: 'var(--surface-2)',
          foreground: 'var(--text-muted)',
        },
      },
      borderRadius: {
        sm: 'var(--r-sm)',
        md: 'var(--r-md)',
        lg: 'var(--r-lg)',
        xl: 'var(--r-xl)',
        full: 'var(--r-full)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        lg: 'var(--shadow-lg)',
      },
      keyframes: {
        'live-pulse': {
          '0%': { transform: 'scale(1)', opacity: '0.8' },
          '50%': { transform: 'scale(1.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '0' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'live-pulse': 'live-pulse 1.8s cubic-bezier(0.22, 1, 0.36, 1) infinite',
        'fade-in': 'fade-in 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
