/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        'delivery-orange': '#ff6b35',
        'delivery-orange-dark': '#e85a2e',
        'delivery-orange-light': '#ff924a',
        'delivery-blue': '#0077b6',
        'delivery-gray': '#f1f5f9',
        'delivery-gray-dark': '#64748b',
      },
    },
  },
  plugins: [],
}
  