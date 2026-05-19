import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    watch: {
      // Necessário para detectar alterações via volume no Docker (Windows)
      usePolling: process.env.CHOKIDAR_USEPOLLING === 'true',
    },
  },
})
