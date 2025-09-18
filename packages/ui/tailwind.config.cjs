/** @type {import('tailwindcss').Config} */
module.exports = {
  ...require("@repo/tailwind-config/tailwind.config.js"),
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
}