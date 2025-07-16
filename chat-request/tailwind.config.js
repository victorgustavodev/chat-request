/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'background': '#ffffff',
        'green-5': '#338264',
        'green-4': '#4C9B7C',
        'green-3': '#64B393',
        'green-2': '#7DCCAB',
        'green-1': '#95E4C2',
        'teste': '#ff00ff',
      },
    },
  },
  plugins: [],
}