// apps/dashboard/tailwind.config.js - Minimal for v4
/** @type {import('tailwindcss').Config} */
export default {
  // Content paths (still needed for scanning)
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  
  // Dark mode (optional, defaults to 'media')
  darkMode: 'class',
  
  // Most theme config now goes in CSS @theme directive!
}