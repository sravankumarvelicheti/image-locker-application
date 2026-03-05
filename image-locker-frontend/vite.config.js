import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const backend = process.env.DOCKER
  ? "http://backend:8080"
  : "http://localhost:8080";

export default defineConfig({
  plugins: [react()],

  // dev mode (vite dev)
  server: {
    proxy: {
      "/api": {
        target: backend,
        changeOrigin: true,
        secure: false,
      },
    },
  },

  // preview mode (vite preview)  <-- THIS FIXES "Blocked request. host not allowed"
  preview: {
    host: "0.0.0.0",
    port: 4173, // keep this matching your Dockerfile
    allowedHosts: ["fromvs.com", "www.fromvs.com"],
  },
});