/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        green: {
          950: "#0D2420",
          900: "#1A3C34",
          800: "#1F4A40",
          700: "#2D6B58",
          600: "#3D8B72",
          100: "#E8F2EB",
          50: "#F4F8F5",
        },
        gold: {
          600: "#9A7A2E",
          500: "#BFA060",
          400: "#D4B878",
          300: "#E8D4A0",
          100: "#FBF6E8",
        },
      },
      fontFamily: {
        display: ["Playfair Display", "serif"],
        sans: ["DM Sans", "sans-serif"],
        label: ["Josefin Sans", "sans-serif"],
        manrope: ["Manrope", "sans-serif"],
      },
      boxShadow: {
        sm: "0 2px 8px rgba(26,60,52,0.06)",
        md: "0 4px 20px rgba(26,60,52,0.10)",
        lg: "0 8px 40px rgba(26,60,52,0.14)",
        gold: "0 4px 20px rgba(191,160,96,0.25)",
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "14px",
        xl: "20px",
        pill: "9999px",
      },
    },
  },
  plugins: [],
};
