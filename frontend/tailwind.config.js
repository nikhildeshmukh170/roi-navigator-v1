/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          500: '#1a3a5c',
          900: '#0A2540',
        },
        brand: {
          orange: '#FF6B35',
          'orange-light': '#FF8C5A',
          green: '#00C48C',
          'green-light': '#E8FBF5',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(10,37,64,.06), 0 1px 2px rgba(10,37,64,.04)',
        'card-md': '0 4px 16px rgba(10,37,64,.08), 0 2px 6px rgba(10,37,64,.04)',
        'card-lg': '0 12px 40px rgba(10,37,64,.12), 0 4px 12px rgba(10,37,64,.06)',
      },
      animation: {
        'pulse-dot': 'pulse-dot 2s ease-in-out infinite',
        'fade-in': 'fadeIn .3s ease',
        'slide-up': 'slideUp .3s ease',
      },
      keyframes: {
        'pulse-dot': {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: .5, transform: 'scale(.85)' },
        },
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(12px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}
