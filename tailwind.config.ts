import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Prod'Oine industrial palette: warm wood, dark metal, neutrals
        wood: {
          dark: "#423829",
          DEFAULT: "#423829",
          light: "#d2baa6",
          warm: "#d2baa6",
        },
        metal: {
          dark: "#1a1a1a",
          DEFAULT: "#2d2d2d",
          muted: "#3d3d3d",
        },
        cream: "#f5f0e8",
        stone: "#e8e4dc",
        // App font color (replaces white for text)
        offWhite: "#e7ded9",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
