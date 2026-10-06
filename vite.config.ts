import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { fileURLToPath } from "node:url"
import { defineConfig } from "vite"

const src = fileURLToPath(new URL("./src", import.meta.url))

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": src,
    },
  },
  server: {
    host: "0.0.0.0",
    port: 43123,
    strictPort: true,
  },
})
