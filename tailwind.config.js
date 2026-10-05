/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        game: {
          bg: '#0a0f1d',
          surface: '#111827',
          card: '#162032',
          cardHover: '#1c2840',
          border: '#24324d',
          borderLight: '#334466',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      animation: {
        'pop-in': 'popIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        'unlock-shackle': 'unlockShackle 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'subtle-pulse': 'subtlePulse 2s ease-in-out infinite',
      },
      keyframes: {
        popIn: {
          '0%': { transform: 'scale(0.92)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        unlockShackle: {
          '0%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
          '100%': { transform: 'translateY(-12px) rotate(-16deg)' },
        },
        subtlePulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        },
      },
    },
  },
  plugins: [],
}
