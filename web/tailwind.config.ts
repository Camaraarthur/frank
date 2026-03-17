import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Beat civic design system
        navy: {
          900: "#0D1B2A",
          800: "#1B2A3B",
          700: "#253447",
          600: "#2E4057",
        },
        amber: {
          500: "#D4840A",
          400: "#E8960F",
          200: "#FFC857",
        },
        slate: {
          100: "#F0F4F8",
          300: "#B8C5D1",
          500: "#6B7F8E",
        },
        recording: "#E53E3E",
        consent: "#00B894",
      },
      fontFamily: {
        sans: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
        ],
      },
      fontSize: {
        base: ["17px", { lineHeight: "1.6" }],
      },
      borderRadius: {
        DEFAULT: "2px",
        sm: "2px",
        md: "4px",
        lg: "6px",
        full: "9999px",
      },
    },
  },
  plugins: [typography],
};

export default config;
