/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgorange: "#FFCFBE",
        navorange: "#FE985F",
        logoorange: "#DD7108",
        hoverDetail: "#F39B46",
        BGDetail: "#F6F9F6",
      },
      fontWeight: {
        semiMedium: '450',
      },
    },
  },
  plugins: [],
}

