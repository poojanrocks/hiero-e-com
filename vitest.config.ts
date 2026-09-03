import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [],
    include: ['ui.frontend/src/test/**/*.test.ts'],
    exclude: ['node_modules', 'dist'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['ui.frontend/src/main/**/*.ts'],
      exclude: [
        'node_modules/',
        'ui.frontend/src/test/',
      ],
    },
  },
});
