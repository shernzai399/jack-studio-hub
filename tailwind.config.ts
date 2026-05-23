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
        ink: "#18201b",
        moss: "#56624f",
        clay: "#9f6b4e",
        linen: "#f6f0e7",
        pearl: "#fbfaf7"
      },
      boxShadow: {
        soft: "0 12px 30px rgba(24, 32, 27, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
