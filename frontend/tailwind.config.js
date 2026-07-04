/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pet: {
          primary: "#10B981",
          secondary: "#0EA5E9",
        },
      },
    },
  },
  plugins: [],
}

