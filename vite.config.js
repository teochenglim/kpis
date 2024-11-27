import { defineConfig } from 'vite';

export default defineConfig({
  base: './', 
  server: {
    host: '0.0.0.0',
    port: process.env.PORT || 3000,
  },
});