import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand green (emerald-forward, premium like NomadSwipe).
        brand: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
          950: "#022c22",
        },
        // Lime accent for highlights/gradients.
        lime: {
          300: "#bef264",
          400: "#a3e635",
          500: "#84cc16",
        },
        // Green-tinted neutrals for backgrounds.
        ink: {
          900: "#070b09",
          800: "#0c1410",
          700: "#121d17",
          600: "#1a2a20",
          500: "#243a2d",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        card: "0 24px 60px -12px rgba(0,0,0,0.7)",
        glow: "0 10px 40px -8px rgba(16,185,129,0.55)",
        soft: "0 8px 30px -10px rgba(0,0,0,0.5)",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #34d399 0%, #a3e635 100%)",
        "hero-glow":
          "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(16,185,129,0.35), transparent)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pop-in": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.3s ease-out",
        "pop-in": "pop-in 0.25s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
