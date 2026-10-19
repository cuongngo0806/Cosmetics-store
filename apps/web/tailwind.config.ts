import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './features/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fdeef4',
          100: '#fbd5e3',
          500: '#ec4899',
          600: '#be185d',
          700: '#9d174d',
          900: '#3b1228',
        },
        cream: '#fdf8f9',
      },
      boxShadow: {
        soft: '0 16px 44px rgba(90, 20, 55, 0.10)',
      },
      borderRadius: {
        '4xl': '1.5rem',
      },
    },
  },
  plugins: [],
};

export default config;

