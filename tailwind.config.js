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
      black: { 
        light: "#262626",
        DEFAULT: "#000000" 
      },
      gray: {
        light: "#E3E3E3",
        DEFAULT: "#707070",
        dark: "#999999",
      }
    },
    extend: {
      borderWidth: {
        "1.5": "1.5px",
      },
      boxShadow: {
        "border": '0px 0px 2px 2px #BFBFBD, inset 0px 0px 2px 2px #BFBFBD',
      },
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
