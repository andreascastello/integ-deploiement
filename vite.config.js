/// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './setupTests.js',
    coverage: {
      include : ['src/**/*.jsx', 'src/**/*.js'],
      exclude: ['node_modules/', 'dist/', 'coverage/', 'src/main.jsx', 'src/App.jsx'],
    }
  },
});