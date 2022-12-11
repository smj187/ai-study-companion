/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{vue,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        poppins: ["Poppins", "sans-serif"]
      },
      maxWidth: {
        "8xl": "1440px"
      },
      gridTemplateColumns: {
        questions: "170px 1fr"
      }
    }
  },
  plugins: []
}

