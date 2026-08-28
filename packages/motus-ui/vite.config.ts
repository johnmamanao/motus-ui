import { resolve } from 'node:path';
import { defineConfig } from 'vite';

const external = [
  '@web-kits/audio',
  'gsap',
  'lottie-react',
  'lucide-react',
  'motion/react',
  'react',
  'react/jsx-runtime',
  'react-use-measure',
];

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: () => 'index.js',
      cssFileName: 'styles',
    },
    rollupOptions: {
      external,
      onwarn(warning, warn) {
        if (warning.message.includes('dynamically imported by') && warning.message.includes('also statically imported'))
          return;
        warn(warning);
      },
      output: {
        banner: "'use client';",
      },
    },
  },
});
