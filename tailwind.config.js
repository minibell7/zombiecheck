/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#09090B', // Deep black
        surface: '#18181B', // Zinc 900
        surfaceHighlight: '#27272A', // Zinc 800
        accent: '#2DD4BF', // Teal 400 (Mint)
        accentHover: '#14B8A6', // Teal 500
        kill: '#F43F5E', // Rose 500
        killHover: '#E11D48', // Rose 600
        warning: '#F59E0B', // Amber 500
        textPrimary: '#FAFAFA', // Zinc 50
        textSecondary: '#A1A1AA', // Zinc 400
        border: '#3F3F46', // Zinc 700
        white: {
          5: 'rgba(255, 255, 255, 0.05)',
          10: 'rgba(255, 255, 255, 0.1)',
          20: 'rgba(255, 255, 255, 0.2)',
        }
      },
      spacing: {
        'safe': 'env(safe-area-inset-bottom)',
      }
    },
  },
  plugins: [],
}
