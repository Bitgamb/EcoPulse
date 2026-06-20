import type { Config } from "tailwindcss";
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-manrope)", "sans-serif"],
        display: ["var(--font-newsreader)", "serif"],
      },
      colors: {
        ink: "#17352a",
        paper: "#f4f6ef",
        forest: "#174c3c",
        emerald: "#1f7a5a",
        lime: "#b8e34b",
        coral: "#ef795f",
      },
      boxShadow: { soft: "0 12px 36px rgba(22,62,48,.09)" },
    },
  },
  plugins: [],
} satisfies Config;
