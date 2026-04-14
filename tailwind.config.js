/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neev-navy':  '#0d1f35',
        'neev-gold':  '#c9a84c',
        'neev-cream': '#f7f3ec',
        'neev-slate': '#3d5166',
        'neev-mist':  '#e8edf5',
        'neev-ink':   '#1a2d42',
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        dmsans:   ['"DM Sans"', 'sans-serif'],
      },
      borderRadius: {
        card: '10px',
      },
      boxShadow: {
        card: '0 1px 4px rgba(13, 31, 53, 0.08)',
        toast: '0 4px 24px rgba(13, 31, 53, 0.22)',
      },
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        fadeIn: {
          '0%':   { opacity: 0, transform: 'translateY(8px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        slideIn: {
          '0%':   { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        toastIn: {
          '0%':   { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        shimmer:  'shimmer 2s infinite linear',
        fadeIn:   'fadeIn 0.2s ease-out forwards',
        slideIn:  'slideIn 0.3s ease-out forwards',
        toastIn:  'toastIn 0.3s ease-out forwards',
      },
    },
  },
  plugins: [],
}
