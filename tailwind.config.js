/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#4da6ff',
          DEFAULT: '#0077cc',
          dark: '#005299',
        },
        secondary: {
          light: '#ffb84d',
          DEFAULT: '#ff9900',
          dark: '#cc7a00',
        },
      },
    },
  },
  plugins: [],
}
