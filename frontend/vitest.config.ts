import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { loadEnvConfig } from '@next/env';

export default defineConfig(() => {
  loadEnvConfig(process.cwd());

  return {
    plugins: [tsconfigPaths(), react()],
    test: {
      environment: 'jsdom',
      server: {
        deps: {
          inline: ['next-auth'],
        },
      },
    },
  };
});
