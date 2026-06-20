import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0b1420",
        navy: "#0f2742",
        slateLine: "#d8e0e8",
        mist: "#f5f7fa",
        financeGreen: "#1f8a5b",
        financeBlue: "#2563eb"
      },
      boxShadow: {
        soft: "0 18px 45px rgba(11, 20, 32, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
