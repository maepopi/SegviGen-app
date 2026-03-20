/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg:      '#0f1117',
        card:    '#1a1d27',
        input:   '#12151f',
        hover:   '#22273a',
        border:  '#2d3248',
        accent:  '#6c8ef5',
        'accent-dark': '#4a6cd4',
        muted:   '#7a849c',
        dim:     '#4a5268',
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
