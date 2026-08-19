/// <reference types="vitest/config" />
import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/sme-integracao-api': {
        target: 'https://hom-smeintegracaoapi.sme.prefeitura.sp.gov.br',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/sme-integracao-api/, ''),
      },
    },
    watch: {
      // Necessário para detectar alterações via volume no Docker (Windows)
      usePolling: process.env.CHOKIDAR_USEPOLLING === 'true',
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/setupTests.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      reporter: ['text', 'lcov', 'html'],
      reportsDirectory: './coverage',
      exclude: [
        'src/components/ui/**',
        'src/**/*.test.{ts,tsx}',
        'src/setupTests.ts',
        'src/components/ui/**',
        '**/*.d.ts',
        'vite.config.ts',
        'eslint.config.js',
      ],
      thresholds: {
        lines: 81,
        statements: 81,
        branches: 81,
        functions: 81,
      },
    },
  },
})
