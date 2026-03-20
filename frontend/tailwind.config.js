/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg:      '#0b1a2e',
        card:    '#102542',
        input:   '#0d1f38',
        hover:   '#163354',
        border:  '#1e3d68',
        accent:  '#f87060',
        'accent-dark': '#d95f4e',
        muted:   '#cdd7d6',
        dim:     '#b3a394',
        success: '#4caf7d',
        danger:  '#e05252',
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
        mono: ['Fira Mono', 'Consolas', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.18s ease',
        'spin-slow': 'spin 0.7s linear infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
