import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Auth mantiene su prefijo API v1
      '/api/v1/auth': {
        target: 'http://localhost:4002',
        changeOrigin: true,
        secure: false,
      },
      // Proxy sólo para `/api` en desarrollo. Evita proxear rutas SPA como /product o /products.
      '/api': {
        target: 'http://localhost:4002',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})