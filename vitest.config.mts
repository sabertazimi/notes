import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    setupFiles: 'tests/setup.ts',
    coverage: {
      exclude: ['tests', '**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}', 'eslint.config.mjs', 'vitest.config.mts'],
      reporter: ['text', 'text-summary', 'lcov'],
    },
  },
})
