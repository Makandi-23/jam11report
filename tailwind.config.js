/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#77A8A8",      // Teal brand
        pale: "#FAFAFA",         // Pale white background
        mystic: "#3CB371",       // Primary CTA (Mystic Jade)
        deepTeal: "#006D77",     // Deep Teal for main CTAs
        amber: "#F59E0B",        // Pending/alert
        info: "#3B82F6",         // In-progress
        success: {
          100: "#D1FAE5",
          500: "#10B981",
          600: "#059669", 
          700: "#047857"
        },
        graysoft: "#F3F4F6",
      },
      borderRadius: {
        xl: "1rem",
      },
      boxShadow: {
        md: "0 6px 16px rgba(16,24,40,0.08)",
        lg: "0 10px 30px rgba(16,24,40,0.12)",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};