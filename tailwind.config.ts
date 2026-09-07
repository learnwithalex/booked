import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      colors: {
        ink: "#14171a",
        forest: {
          50: "#edf6f1",
          100: "#d3e9dd",
          200: "#a7d3bb",
          300: "#6fb694",
          400: "#3f9a73",
          500: "#1f7d59",
          600: "#166448",
          700: "#124f3a",
          800: "#0e3d2d",
          900: "#0a2c21",
        },
        sand: {
          50: "#faf8f4",
          100: "#f4f0e8",
          200: "#e9e2d5",
          300: "#d9cfbc",
        },
        // measured from bench.co — used only by /replica
        bench: {
          navy: "#062D60",
          ink: "#121316",
          green: "#3FA684",
          blue: "#0A5AC2",
          ghost: "#F7F8FA",
          yolk: "#FCD269",
          gold: "#B4913B",
        },
      },
      borderRadius: {
        xs: "3px",
        sm: "4px",
        DEFAULT: "6px",
      },
    },
  },
  plugins: [],
};

export default config;
