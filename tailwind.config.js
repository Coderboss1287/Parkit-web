/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        parkit: {
          sky: "#35B5F6",
          royal: "#0752B5",
          green: "#75D84C",
          white: "#FFFFFF",
          bg: "#F7FAFC",
          dark: "#172B4D",
          darker: "#0C1A30",
          card: "#FFFFFF",
          border: "#E2E8F0",
          muted: "#64748B",
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-sky': '0 0 25px rgba(53, 181, 246, 0.35)',
        'glow-green': '0 0 25px rgba(117, 216, 76, 0.35)',
        'glow-royal': '0 0 25px rgba(7, 82, 181, 0.35)',
        'premium': '0 10px 30px -5px rgba(7, 82, 181, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
        'premium-lg': '0 20px 40px -10px rgba(7, 82, 181, 0.12), 0 8px 16px -4px rgba(0, 0, 0, 0.04)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
