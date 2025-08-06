/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        'vibe-blue': '#90CAF9',
        'vibe-blue-dark': '#1976D2',
        'vibe-light': '#E3F2FD',
        'vibe-white': '#FFFFFF',
      },
      fontFamily: {
        'sans': ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      height: {
        'screen-mobile': '100vh',
      },
      width: {
        'screen-mobile': '100vw',
      }
    },
  },
  plugins: [],
}
