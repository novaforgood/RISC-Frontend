module.exports = {
  purge: ["./src/**/*.{ts,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      blue: {
        light: "#0B9ED9",
        DEFAULT: "#0433BF",
        dark: "#021859",
      },
      white: { DEFAULT: "#FFFFFF" },
      gray: { DEFAULT: "#707070" },
      black: { DEFAULT: "#000000" },
    },
    extend: {
      spacing: {
        13.5: "3.375rem",
        41: "10.25rem",
        86: "21.5rem",
      },
    },
    fontFamily: {
      sans: ["Inter", "sans-serif"],
    },
    fontSize: {
      // Styleguide in px, tailwind in rem
      h1: "48px",
      h2: "36px",
      h3: "24px",
      "body-1": "22px",
      "body-2": "16px",
      caption: "12px",
    },
    fontWeight: {
      normal: 400,
      bold: 700,
    },
    // textColor: {
    //   black: "#2C2C2C",
    //   gray: "#707070",
    // },
  },
  variants: {
    extend: {
      backgroundColor: ["active"],
      borderWidth: ["hover"],
      opacity: ["disabled"],
      textColor: ["active"],
    },
  },
  plugins: [],
};
