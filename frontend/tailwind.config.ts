import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./pages/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}', './app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      keyframes: {
        shiftXY: {
          '0%': { transform: 'translate(0)' },
          '100%': { transform: 'translate(-10px,-10px)' },
        },
      },
      animation: {
        'shift-dark': 'shiftXY 0.25s linear 1',
      },
    },
  },
  plugins: [],
};
export default config;
