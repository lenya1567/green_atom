import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 3000,
    proxy: {
      "/directus": {
        target: "http://directus:8055",
        rewrite: (path) => path.replace(/^\/directus/, ''),
      },
      "/admin": {
        target: "http://directus:8055",
      },
      "/auth": {
        target: "http://directus:8055",
      }
    },
  }
})
