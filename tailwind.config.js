const { fontFamily } = require("tailwindcss/defaultTheme")

/** @type {import('tailwindcss').Config} */
module.exports = {
  mode:'jit',
  content: ["src/**/*.{ts,tsx}", "components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        primary: ['Lato', 'sans-serif'], 
      },
 colors: {
    background: {
        100: 'rgba(var(--background-100))',
        200: 'rgba(var(--background-200))',
        300: 'rgba(var(--background-300))',
        400: 'rgba(var(--background-400))',
        500: 'rgba(var(--background-500))', // Default
        600: 'rgba(var(--background-600))',
        700: 'rgba(var(--background-700))',
        800: 'rgba(var(--background-800))',
        900: 'rgba(var(--background-900))',
    },
    foreground: {
        100: 'rgba(var(--foreground-100))',
        200: 'rgba(var(--foreground-200))',
        300: 'rgba(var(--foreground-300))',
        400: 'rgba(var(--foreground-400))',
        500: 'rgba(var(--foreground-500))', // Default
        600: 'rgba(var(--foreground-600))',
        700: 'rgba(var(--foreground-700))',
        800: 'rgba(var(--foreground-800))',
        900: 'rgba(var(--foreground-900))',
    },
    primary: {
        100: 'rgba(var(--primary-100))',
        200: 'rgba(var(--primary-200))',
        300: 'rgba(var(--primary-300))',
        400: 'rgba(var(--primary-400))',
        500: 'rgba(var(--primary-500))', // Default
        600: 'rgba(var(--primary-600))',
        700: 'rgba(var(--primary-700))',
        800: 'rgba(var(--primary-800))',
        900: 'rgba(var(--primary-900))',
    },
    secondary: {
        100: 'rgba(var(--secondary-100))',
        200: 'rgba(var(--secondary-200))',
        300: 'rgba(var(--secondary-300))',
        400: 'rgba(var(--secondary-400))',
        500: 'rgba(var(--secondary-500))', // Default
        600: 'rgba(var(--secondary-600))',
        700: 'rgba(var(--secondary-700))',
        800: 'rgba(var(--secondary-800))',
        900: 'rgba(var(--secondary-900))',
    },
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"),
    function ({ addUtilities }) {
      addUtilities({
        '.no-scrollbar': {
          /* Hide scrollbar in Webkit-based browsers like Chrome and Safari */
          '-webkit-overflow-scrolling': 'touch',
          '-ms-overflow-style': 'none',  // IE 10+
          'scrollbar-width': 'none',     // Firefox
        },
        '.no-scrollbar::-webkit-scrollbar': {
          display: 'none', // Chrome, Safari, and Opera
        },
      });
    },
  ],
}
