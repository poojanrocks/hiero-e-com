import { defineConfig } from 'vitest/config';
import { getViteConfig } from './ui.frontend/vite.config';

export default defineConfig({
  ...getViteConfig(),
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./ui.frontend/src/tests/setup.ts'],
    include: ['ui.frontend/src/**/*.test.ts', 'ui.frontend/src/**/*.test.tsx'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'ui.frontend/src/tests/setup.ts',
      ],
    },
  },
});
