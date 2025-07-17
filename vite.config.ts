import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    viteStaticCopy({
      targets: [
        {
          src: "node_modules/tinymce/skins",
          dest: "tinymce", // sẽ copy vào dist/tinymce/skins
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@features": path.resolve(__dirname, "./src/features"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@types": path.resolve(__dirname, "./src/types"),
      "@contexts": path.resolve(__dirname, "./src/contexts"),
      "@config": path.resolve(__dirname, "./src/config"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@layouts": path.resolve(__dirname, "./src/layouts"),
      "@routes": path.resolve(__dirname, "./src/routes"),
      "@common": path.resolve(__dirname, "./src/common"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      // Cấu hình proxy cho API
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
      // Cấu hình proxy cho uploads
      "/uploads": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
    },
    fs: {
      // Cho phép serve files từ node_modules
      allow: [".."],
    },
  },
  // Tối ưu cho TinyMCE
  optimizeDeps: {
    include: ["tinymce"],
  },
  build: {
    sourcemap: false, // Tắt sourcemap để giảm complexity
    target: "esnext",
    rollupOptions: {
      treeshake: false, // Tắt treeshake để tránh mất CSS/components
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"],
          mui: ["@mui/material", "@mui/icons-material"],
          query: ["@tanstack/react-query"],
        },
      },
    },
    minify: "esbuild", // Dùng esbuild thay vì rollup để minify
    chunkSizeWarningLimit: 1000,
  },
});
