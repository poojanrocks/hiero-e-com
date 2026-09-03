import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./src/tests/setup.ts'],
    include: ['src/tests/**/*.test.ts', 'src/test/ts/**/*.test.ts']
  },
  resolve: {
    alias: {
      '@services': path.resolve(__dirname, './src/main/ts/services'),
      '@components': path.resolve(__dirname, './src/main/ts/components'),
      '@utils': path.resolve(__dirname, './src/main/ts/utils'),
      '@patterns': path.resolve(__dirname, './src/main/ts/patterns'),
      '@': path.resolve(__dirname, './src')
    }
  }
});