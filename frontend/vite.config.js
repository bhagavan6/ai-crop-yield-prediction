import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/predict": "https://cropai-backend-sroa.onrender.com",
      "/health": "https://cropai-backend-sroa.onrender.com",
    },
  },
});