/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: { maroon: { DEFAULT: '#7B1818', dark: '#5C1212' } },
    },
  },
  plugins: [],
}
