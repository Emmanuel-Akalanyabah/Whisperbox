/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        ink: {
          50: '#f8f7f4',
          100: '#eeece6',
          200: '#dcd8cc',
          300: '#c4bfaf',
          400: '#a89f8a',
          500: '#8f8370',
          600: '#756b5a',
          700: '#5e5548',
          800: '#4c453b',
          900: '#3d3830',
          950: '#1e1c18',
        },
        whisper: {
          50: '#fdf4f0',
          100: '#fbe6de',
          200: '#f6ccbc',
          300: '#f0a993',
          400: '#e87c60',
          500: '#de5a3c',
          600: '#c94329',
          700: '#a83622',
          800: '#8a2f21',
          900: '#722b20',
          950: '#3e130d',
        },
        void: {
          50: '#f0f0f5',
          100: '#e2e2eb',
          200: '#c5c6d8',
          300: '#a1a3bc',
          400: '#7a7c9f',
          500: '#5e6084',
          600: '#4b4d6b',
          700: '#3d3f57',
          800: '#34364a',
          900: '#1a1b2e',
          950: '#0d0e1a',
        }
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      backgroundImage: {
        'grain': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}
