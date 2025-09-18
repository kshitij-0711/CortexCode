/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Add paths to all packages that will use Tailwind
    "../../apps/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Your custom theme extensions
    },
  },
  plugins: [],
}