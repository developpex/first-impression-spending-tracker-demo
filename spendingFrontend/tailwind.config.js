/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        offwhite: '#f6f7eb',
        accent: '#e94f37',
        dark: '#393e41',
      },
    },
  },
  plugins: [],
};