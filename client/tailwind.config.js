/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary:   '#1E3A8A',  // Deep Blue
        success:   '#10B981',  // Emerald Green
        warning:   '#F97316',  // Orange
        surface:   '#F3F4F6',  // Light Gray
        dark:      '#374151',  // Dark Gray
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body:    ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}