import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, '');
  return {
    define: {
      'process.env.SDKWORK_ACCESS_TOKEN': JSON.stringify(env.SDKWORK_ACCESS_TOKEN ?? ''),
    },
          plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@sdk': path.resolve(__dirname, '../../sdks/sdkwork-appstore-app-sdk/sdkwork-appstore-app-sdk-typescript'),
    },
  },
  server: {
    port: 3001,
    proxy: {
      '/app/v3/api': {
        target: 'http://127.0.0.1:18090',
        changeOrigin: true,
      },
    },
  },
  };
});