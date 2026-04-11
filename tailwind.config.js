/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        kahoot: {
          purple: '#46178f',
          'purple-deep': '#250246',
          indigo: '#1368ce',
          lime: '#6dfe60',
          yellow: '#ffc00a',
          coral: '#ff5c5c',
        },
      },
      boxShadow: {
        card: '0 4px 0 rgba(0,0,0,0.15)',
        'card-lg': '0 6px 0 rgba(0,0,0,0.12)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.98)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 300ms ease-out',
        slideUp: 'slideUp 400ms ease-out both',
        shimmer: 'shimmer 2.5s linear infinite',
      },
      backgroundImage: {
        'gradient-game': 'linear-gradient(135deg, #4f46e5 0%, #9333ea 100%)',
        'gradient-host':
          'linear-gradient(160deg, #46178f 0%, #250246 45%, #1368ce 100%)',
      },
    },
  },
  plugins: [],
};