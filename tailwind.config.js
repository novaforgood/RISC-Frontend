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
      black: { DEFAULT: "#000000" },
    },
    extend: {
      spacing: {
        13.5: "3.375rem",
        41: "10.25rem",
        86: "21.5rem",
      },
    },
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
