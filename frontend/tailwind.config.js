/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bgorange: "#FFCFBE",
        navorange: "#FE985F",
        logoorange: "#DD7108",
        hoverDetail: "#F39B46",
        BGDetail: "#F6F9F6",
        colorGray: "#999999",
      },
      backgroundImage: {
        homeBG:
          "url('https://res.cloudinary.com/dv6cae2zi/image/upload/v1754334673/home-bg_x0yliu.jpg')",
      },
    },
  },
  plugins: [],
};
