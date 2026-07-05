import tailwindcss from '@tailwindcss/vite';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, '');
  return {
    define: {
      'process.env.SDKWORK_ACCESS_TOKEN': JSON.stringify(env.SDKWORK_ACCESS_TOKEN ?? ''),
    },
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@sdkwork/sdk-common': path.resolve(
          __dirname,
          '../../../sdkwork-sdk-commons/sdkwork-sdk-common-typescript/src/index.ts',
        ),
      },
    },
    server: {
      port: 3000,
      proxy: {
        '/app/v3/api': {
          target: 'http://127.0.0.1:18090',
          changeOrigin: true,
        },
        '/store/v3/api': {
          target: 'http://127.0.0.1:18092',
          changeOrigin: true,
        },
      },
    },
  };
});
