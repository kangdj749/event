import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      /* =========================
         SPACING SYSTEM
      ========================= */
      spacing: {
        18: "72px",
        22: "88px",
        26: "104px",
        30: "120px",

        70: "280px",
        80: "320px",
        90: "360px",
        105: "420px",
        130: "520px",

        170: "680px",
        190: "760px",
        205: "820px",
        300: "1200px",
      },

      /* =========================
         CONTAINER WIDTH
      ========================= */
      maxWidth: {
        container: "1200px",
        content: "760px",
        text: "680px",
      },

      /* =========================
         RADIUS SYSTEM
      ========================= */
      borderRadius: {
        sm: "10px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        "2xl": "40px",
      },

      /* =========================
         SHADOW SYSTEM
      ========================= */
      boxShadow: {
        soft: "0 10px 40px rgba(0,0,0,0.06)",
        card: "0 20px 60px rgba(0,0,0,0.08)",
        heavy: "0 30px 80px rgba(0,0,0,0.12)",
      },

      /* =========================
         COLOR SYSTEM
      ========================= */
      colors: {
        primary: {
          DEFAULT: "#D97706",
          dark: "#B45309",
          light: "#F59E0B",
        },
        neutral: {
          50: "#fafafa",
          100: "#f5f5f5",
          200: "#e5e5e5",
          300: "#d4d4d4",
          400: "#a3a3a3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;