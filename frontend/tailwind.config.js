/** @type {import('tailwindcss').Config} */
import {colors as defaultColors} from 'tailwindcss/defaultTheme'
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors : {
        ...defaultColors,
        nav : "#ffc300",
        newnav : "#415a77"
      },
      fontFamily : {
        custom1 : ["Afacad Flux"],
        custom2 : ["DM Sans"],
        custom3 : ["Oswald"]
      }
    },
  },
  plugins: [],
}