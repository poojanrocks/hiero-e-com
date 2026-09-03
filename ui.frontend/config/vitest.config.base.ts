import { defineConfig } from 'vitest/config';
import path from 'path';

export function getVitestConfig() {
  return defineConfig({
    test: {
      environment: 'happy-dom',
      globals: true,
      setupFiles: ['./ui.frontend/config/test.setup.ts'],
      include: ['ui.frontend/src/test/**/*.test.ts'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        include: ['ui.frontend/src/main/**/*.ts'],
        exclude: ['ui.frontend/src/main/**/*.d.ts'],
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '../src/main/ts'),
        '@services': path.resolve(__dirname, '../src/main/ts/services'),
        '@components': path.resolve(__dirname, '../src/main/ts/components'),
        '@utils': path.resolve(__dirname, '../src/main/ts/utils'),
        '@patterns': path.resolve(__dirname, '../src/main/ts/patterns'),
      },
    },
  });
}
