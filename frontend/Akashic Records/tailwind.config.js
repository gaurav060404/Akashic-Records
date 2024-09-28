/** @type {import('tailwindcss').Config} */
import { colors as defaultColors } from 'tailwindcss/defaultTheme'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ...defaultColors,
        "purp": "#14213d",
        "nav" : "#778da9",
        "navhover" : "#4e6c91"
      },
    },
  },
  plugins: [],
}

