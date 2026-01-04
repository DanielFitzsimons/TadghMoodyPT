/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0A1A2F",
          deep: "#050E1A",
        },
        sea: {
          DEFAULT: "#2FB3FF",
          muted: "#1E7FBF",
        },
      },
    },
  },
  plugins: [],
};
