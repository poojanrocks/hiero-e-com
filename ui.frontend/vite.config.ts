import { defineConfig } from 'vite';

export function getViteConfig() {
  return {
    resolve: {
      alias: {
        '@': '/ui.frontend/src',
      },
    },
  };
}

export default defineConfig(getViteConfig());
