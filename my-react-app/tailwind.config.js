/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#f44336',
          dark: '#d32f2f',
          light: '#ef5350'
        }
      }
    },
  },
  plugins: [],
}
