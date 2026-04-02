import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // 1. I NOSTRI FONT (Useremo le variabili che imposteremo nel Layout)
      fontFamily: {
        serif: ["var(--font-playfair)", "serif"], 
        sans: ["var(--font-inter)", "sans-serif"],
      },
      // 2. IL COLORE ORO "EDITORIALE"
      colors: {
        gold: {
          200: '#D4AF37', 
        }
      },
      // 3. LE ANIMAZIONI "FIGHE"
      keyframes: {
        'slow-zoom': {
          '0%': { transform: 'scale(1.0)' },
          '100%': { transform: 'scale(1.1)' },
        },
        'scroll-line': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        }
      },
      animation: {
        'slow-zoom': 'slow-zoom 20s ease-in-out infinite alternate',
        'scroll-line': 'scroll-line 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
export default config;