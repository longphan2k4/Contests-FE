/** */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}', // Scan all JS/TS/JSX/TSX files in src
  ],
  darkMode: 'class', // Enable dark mode based on the 'dark' class
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#667eea',
          dark: '#764ba2',
        },
      },
    },
  },
  plugins: [],
};