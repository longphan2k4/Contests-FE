import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    proxy: {
      // Cấu hình proxy cho API
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      },
      // Cấu hình proxy cho uploads
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    }
  }
});
