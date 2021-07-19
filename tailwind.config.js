const plugin = require("tailwindcss/plugin");
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
      beige: { DEFAULT: "#F9F4EB" },
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
        3: "3px",
      },
      boxShadow: {
        border: "0px 0px 2px 2px #BFBFBD, inset 0px 0px 2px 2px #BFBFBD",
      },
      cursor: {
        grab: "grab",
        "s-resize": "s-resize",
        "w-resize": "w-resize",
        "se-resize": "se-resize",
        "sw-resize": "sw-resize",
      },
      height: {
        "3/4-screen": "75vh",
        "9/10": "90%",
      },
      maxHeight: {
        "3/4": "75%",
      },
      spacing: {
        0.25: "0.0625rem",
        13.5: "3.375rem",
        41: "10.25rem",
        86: "21.5rem",
        120: "30rem",
        152: "38rem",
        160: "40rem",
        200: "50rem",
        300: "75rem",
        400: "100rem",
      },
      transitionProperty: {
        background: "background-color",
      },
      width: {
        "9/10": "90%",
        "36rem": "36rem",
      },
      zIndex: {
        "-1": "-1",
      },
      stroke: (theme) => ({
        white: theme("colors.white"),
      }),
      fill: {
        none: "none",
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ["active", "disabled", "checked"],
      borderWidth: ["hover", "active", "disabled"],
      cursor: ["hover", "disabled"],
      borderColor: ["hover", "active", "disabled", "checked"],
      opacity: ["disabled"],
      pointerEvents: ["disabled"],
      textColor: ["active", "disabled", "checked"],
      ringWidth: ["hover", "active"],
      ringColor: ["hover", "active"],
      fontWeight: ["hover"],
      boxShadow: ["active"],
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      const newUtilities = {
        ".strokeLinecap-round": {
          strokeLinecap: "round",
        },
      };
      addUtilities(newUtilities, ["responsive", "hover"]);
    }),
    // require("@tailwindcss/typography"),
    // require("@tailwindcss/forms"),
    // require("@tailwindcss/line-clamp"),
    // require("@tailwindcss/aspect-ratio"),
  ],
};
