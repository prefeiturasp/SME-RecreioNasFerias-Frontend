import path from 'node:path'
import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./src/setupTests.ts'],
      include: ['src/**/*.test.{ts,tsx}'],
      coverage: {
        provider: 'v8',
        all: true,
        include: ['src/**/*.{ts,tsx}'],
        reporter: ['text', 'lcov', 'html'],
        reportsDirectory: './coverage',
        exclude: [
          'src/**/*.test.{ts,tsx}',
          'src/setupTests.ts',
          '**/*.d.ts',
          'vite.config.ts',
          'vitest.config.ts',
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
  }),
)
