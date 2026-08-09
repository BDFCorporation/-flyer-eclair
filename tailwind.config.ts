import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/emails/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#201e26",
        paper: "#f6f4f1",
        accent: {
          DEFAULT: "#a8672c",
          strong: "#8a5522",
          tint: "#f1e3d2"
        }
      },
      fontFamily: {
        display: ["Georgia", "ui-serif", "serif"],
        body: ["-apple-system", "Segoe UI", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
