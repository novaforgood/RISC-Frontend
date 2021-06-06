module.exports = {
  purge: ["./src/**/*.{ts,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      primary: { DEFAULT: "#262626" },
      secondary: { DEFAULT: "#737373" },
      tertiary: { DEFAULT: "#F2F2F2" },
      inactive: { DEFAULT: "#E3E3E3" },
      error: { DEFAULT: "#DB3B25" },
      white: { DEFAULT: "#FFFFFF" },
      black: { DEFAULT: "#000000" },
      skyblue: { DEFAULT: "#7AC5F8" },
      darkblue: { DEFAULT: "#2B4B7B" },
    },

    fontFamily: {
      sans: ["Inter", "sans-serif"],
    },
    fontSize: {
      // Styleguide in px, tailwind in rem
      h1: "3rem",
      h2: "2.25rem",
      h3: "1.5rem",
      "body-1": "1.375rem",
      "body-2": "1rem",
      caption: "0.75",
    },
    fontWeight: {
      normal: 400,
      bold: 700,
    },
    extend: {
      borderWidth: {
        1.5: "1.5px",
      },
      boxShadow: {
        border: "0px 0px 2px 2px #BFBFBD, inset 0px 0px 2px 2px #BFBFBD",
      },
      spacing: {
        0.25: "0.0625rem",
        13.5: "3.375rem",
        41: "10.25rem",
        86: "21.5rem",
        120: "30rem",
        160: "40rem",
        200: "50rem",
      },
      cursor: {
        grab: "grab",
      },
      transitionProperty: {
        background: "background-color",
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ["active", "disabled"],
      borderWidth: ["hover", "active", "disabled"],
      borderColor: ["hover", "active", "disabled"],
      cursor: ["disabled"],
      opacity: ["disabled"],
      pointerEvents: ["disabled"],
      textColor: ["active", "disabled"],
      ringWidth: ["active"],
      ringColor: ["active"],
    },
  },
  plugins: [
    // require("@tailwindcss/typography"),
    // require("@tailwindcss/forms"),
    // require("@tailwindcss/line-clamp"),
    // require("@tailwindcss/aspect-ratio"),
  ],
};
