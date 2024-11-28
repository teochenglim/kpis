import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  server: {
    port: 3000
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
});