import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'html-transform',
      transformIndexHtml(html) {
        return html
          .replace('%VITE_APP_NAME%', process.env.VITE_APP_NAME || 'Fluent - Speak with Confidence')
          .replace(
            '%VITE_APP_DESCRIPTION%',
            process.env.VITE_APP_DESCRIPTION ||
              'An app to help you identify and reduce filler words in your speech'
          );
      },
    },
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.ts',
  },
  server: {
    port: 3000,
    host: true,
  },
});
