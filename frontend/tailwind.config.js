/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        'vibe-blue': '#3b82f6',
        'vibe-blue-dark': '#2563eb',
        'vibe-light': '#dbeafe',
        'vibe-white': '#FFFFFF',
        'instagram-blue': '#405DE6',
        'instagram-purple': '#5851DB',
        'instagram-pink': '#833AB4',
        'instagram-red': '#C13584',
        'instagram-orange': '#E1306C',
        'instagram-yellow': '#FD1D1D',
      },
      fontFamily: {
        'sans': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      height: {
        'screen-mobile': '100vh',
      },
      width: {
        'screen-mobile': '100vw',
      },
      animation: {
        'like': 'like 0.3s ease-in-out',
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        like: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      backgroundImage: {
        'instagram-gradient': 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
        'story-gradient': 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
      },
      boxShadow: {
        'instagram': '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
        'instagram-lg': '0 10px 25px rgba(0, 0, 0, 0.15), 0 4px 10px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
}
