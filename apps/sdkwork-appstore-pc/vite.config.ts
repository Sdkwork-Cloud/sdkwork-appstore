import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@sdk': path.resolve(__dirname, '../../sdks/sdkwork-appstore-app-sdk/sdkwork-appstore-app-sdk-typescript'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/app/v3/api': {
        target: 'http://127.0.0.1:18090',
        changeOrigin: true,
      },
    },
  },
});
