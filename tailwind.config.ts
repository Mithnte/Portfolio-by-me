import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        roblox: {
          DEFAULT: "#38bdf8",
          glow: "rgba(56, 189, 248, 0.35)",
        },
        blender: {
          DEFAULT: "#f59e0b",
          glow: "rgba(245, 158, 11, 0.35)",
        },
        fivem: {
          DEFAULT: "#10b981",
          glow: "rgba(16, 185, 129, 0.35)",
        },
      },
      boxShadow: {
        "glow-roblox": "0 0 24px rgba(56, 189, 248, 0.25)",
        "glow-blender": "0 0 24px rgba(245, 158, 11, 0.25)",
        "glow-fivem": "0 0 24px rgba(16, 185, 129, 0.25)",
      },
      keyframes: {
        pulseSlow: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
      animation: {
        "pulse-slow": "pulseSlow 2.5s ease-in-out infinite",
        blink: "blink 1s step-start infinite",
      },
    },
  },
  plugins: [],
};

export default config;
