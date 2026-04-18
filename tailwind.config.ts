import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fff1ed",
          100: "#ffe0d5",
          200: "#ffc1aa",
          300: "#ff9875",
          400: "#ff6840",
          500: "#ff441f",
          600: "#e62a12",
          700: "#bf1b0d",
          800: "#99170f",
          900: "#7f1710",
        },
        rappi: {
          red: "#ff1f1f",
          orange: "#ff6a00",
          ink: "#21120f",
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
  ],
};

export default config;
