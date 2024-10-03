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
        nav : "#14213d",
        newnav : "#415a77"
      },
      fontFamily : {
        custom : ["Afacad Flux"],
      }
    },
  },
  plugins: [],
}