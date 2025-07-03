import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        brand: {
          DEFAULT: "#4338CA", // indigo-700
          primary: "#4338CA", // indigo-700
          secondary: "#3730A3", // indigo-800
        },
        success: "#16A34A", // green-600
        warning: "#D97706", // amber-600
        danger: "#DC2626", // red-600
      },
      fontFamily: {
        // Inter remains the default sans-serif font
        sans: ["var(--font-inter)", "sans-serif"],

        // Add a new font family for Farsi
        farsi: ["var(--font-nahid)", "sans-serif"],
      },
    },
  },

  plugins: [],
};
export default config;
