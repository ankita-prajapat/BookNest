/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FAF8F5',
          100: '#FAF6F0',
          200: '#F4EAE1',
          300: '#EADAC9',
        },
        espresso: {
          100: '#E4DFDC',
          500: '#52433F',
          800: '#2C1B18',
          900: '#241614',
          950: '#1E110F',
        },
        terracotta: {
          100: '#F5E4E0',
          500: '#C05C46',
          600: '#A54B36',
          700: '#8A3C2A',
        },
        sage: {
          100: '#ECEFEB',
          500: '#8A9A86',
          600: '#73836F',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Outfit"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'pin': '0 1px 20px 0 rgba(0, 0, 0, 0.05)',
        'pin-hover': '0 10px 25px 0 rgba(44, 27, 24, 0.12)',
      }
    },
  },
  plugins: [],
}
