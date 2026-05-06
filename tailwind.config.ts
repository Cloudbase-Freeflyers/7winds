import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          sky: "#1ABBEF",
          green: "#8BC441",
          yellow: "#FDD62A",
          dark: "#4E4E4E",
          black: "#050606",
          soft: "#F5F8FA",
          white: "#FFFFFF",
        },
      },
      fontFamily: {
        sans: ["var(--font-heebo)", "var(--font-assistant)", "system-ui", "sans-serif"],
        display: ["var(--font-rubik)", "var(--font-heebo)", "sans-serif"],
      },
      backgroundImage: {
        "sky-gradient":
          "linear-gradient(135deg, #1ABBEF 0%, #8BC441 60%, #FDD62A 100%)",
        "hero-radial":
          "radial-gradient(circle at 30% 30%, rgba(26,187,239,0.35), transparent 60%), radial-gradient(circle at 80% 70%, rgba(139,196,65,0.35), transparent 60%), linear-gradient(160deg, #050606 0%, #1a2a35 100%)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        floaty: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        marquee: "marquee 28s linear infinite",
        floaty: "floaty 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
