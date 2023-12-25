import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import mkcert from "vite-plugin-mkcert"

const apiUrl = process.env.API_URL

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), mkcert()],
  server: {
    proxy: {
      "/api": {
        target: apiUrl,
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
})
