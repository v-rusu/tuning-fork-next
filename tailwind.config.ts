import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{astro,html,js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fffef5',
          100: '#fffce6',
          200: '#fff5b3',
          300: '#ffed80',
          400: '#ffe14d',
          500: '#ffc600',
          600: '#e6b200',
          700: '#b38a00',
          800: '#806300',
          900: '#4d3b00',
        },
        tuner: {
          sharp: '#ff5d55',
          flat: '#ffc600',
          inTune: '#4ade80',
          background: '#111111',
          card: '#1a1a1a',
          highlight: '#ffc600',
          faded: '#333333',
        },
        accent: '#ff5d55',
        text: {
          primary: '#ddddcc',
          secondary: '#999988',
          muted: '#666655',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['monospace'],
      },
      screens: {
        xs: '375px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
      },
      minHeight: {
        touch: '44px',
      },
      minWidth: {
        touch: '44px',
      },
    },
  },
  plugins: [],
};

export default config;
