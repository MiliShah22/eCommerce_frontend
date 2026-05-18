import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        syne: ['var(--font-syne)', 'sans-serif'],
        dm: ['var(--font-dm)', 'sans-serif'],
      },
      colors: {
        bg: { DEFAULT: '#0a0a0f', 2: '#12121a', 3: '#1a1a26', 4: '#22223a' },
        card: { DEFAULT: '#16161f', 2: '#1e1e2e' },
        border: { DEFAULT: 'rgba(255,255,255,0.07)', 2: 'rgba(255,255,255,0.12)' },
        food: { DEFAULT: '#ff6b35', light: '#ff8c5a' },
        grocery: { DEFAULT: '#00c896', light: '#00e6a8' },
        laundry: { DEFAULT: '#7c6fff', light: '#9d90ff' },
        clothing: { DEFAULT: '#ff4d9e', light: '#ff73b8' },
        gold: '#f5c842',
        text: { DEFAULT: '#f0f0f8', 2: '#a0a0c0', 3: '#6060a0' },
      },
      borderRadius: {
        '4xl': '2rem',
      },
      animation: {
        'slide-in': 'slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        'fade-up': 'fadeUp 0.3s ease',
        'pulse-ring': 'pulseRing 1.5s infinite',
      },
      keyframes: {
        slideIn: { from: { transform: 'translateX(100%)' }, to: { transform: 'translateX(0)' } },
        fadeUp: { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        pulseRing: { '0%,100%': { boxShadow: '0 0 0 0 rgba(255,107,53,0.5)' }, '50%': { boxShadow: '0 0 0 8px rgba(255,107,53,0)' } },
      },
    },
  },
  plugins: [],
}
export default config
