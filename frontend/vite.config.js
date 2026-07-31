import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Split large, independently-cacheable vendors into their own chunks so the
    // main app code stays small and Firebase can load in parallel / be cached
    // across deploys instead of re-downloading with every app change.
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'firebase-firestore': ['firebase/app', 'firebase/firestore'],
          'firebase-auth': ['firebase/auth'],
        },
      },
    },
    chunkSizeWarningLimit: 900,
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      }
    }
  }
})
