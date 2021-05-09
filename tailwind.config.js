module.exports = {
  purge: ["./src/**/*.{ts,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    borderWidth: {
      DEFAULT: '1.5px',
      '0': '0px',
      '2': '2px',
      '4': '4px',
      '6': '6px',
      '8': '8px',
    },
    colors: {
      blue: {
        light: "#0B9ED9",
        DEFAULT: "#0433BF",
        dark: "#021859",
      },
      white: { DEFAULT: "#FFFFFF" },
      gray: { 
        light: "#E3E3E3",
        DEFAULT: "#707070",
        dark: "#999999",
      },
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