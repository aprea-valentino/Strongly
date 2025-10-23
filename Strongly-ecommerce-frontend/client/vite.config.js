import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Todo lo que empiece con /api/v1 va al backend
      '/api/v1/auth': {
        target: 'http://localhost:4002',
        changeOrigin: true,
        secure: false,
      },
      // Todo lo que empiece con /product, /cart, /categories, etc. también
      '/product': {
        target: 'http://localhost:4002',
        changeOrigin: true,
        secure: false,
      },
      '/cart': {
        target: 'http://localhost:4002',
        changeOrigin: true,
        secure: false,
      },
      '/categories': {
        target: 'http://localhost:4002',
        changeOrigin: true,
        secure: false,
      },
      '/orders': {
        target: 'http://localhost:4002',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})