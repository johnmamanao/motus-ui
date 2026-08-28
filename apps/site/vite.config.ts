import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      'motus-ui': resolve(__dirname, '../../packages/motus-ui/src/index.ts'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          lottie: ['lottie-react', 'lottie-web'],
        },
      },
    },
  },
  server: {
    host: '0.0.0.0',
    port: 4174,
  },
});
