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
        newnav : "#415a77",
        custom : "#EDF1F5"
      },
      fontFamily : {
        custom1 : ["Afacad Flux"],
        custom2 : ["DM Sans"],
        custom3 : ["Oswald"],
        custom4 : ["Poppins"]
      },
      boxShadow : {
        custom: '70px 50px 40px 40px rgba(0, 0, 0, 0.3)',
      }
    },
  },
  plugins: [],
}