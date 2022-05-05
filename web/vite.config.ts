import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import WindiCSS from "vite-plugin-windicss";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    WindiCSS({
      config: {
        theme: {
          extend: {
            fontFamily: {
              sans: ["Pretendo", "sans-serif"],
            },
          },
        },
      },
    }),
  ],
  server: {
    proxy: {
      "/ws": {
        target: "http://localhost:8765",
        ws: true,
      },
    },
  },
});
