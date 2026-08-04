import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { createSdkworkCredentialEntryBootstrapVitePlugin } from '@sdkwork/iam-credential-entry/vite';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => {
  const environment = mode.includes('production')
    ? 'production'
    : mode.includes('test') || mode.includes('staging')
      ? 'test'
      : 'development';

  return {
    plugins: [
      createSdkworkCredentialEntryBootstrapVitePlugin({
        accessToken: process.env.SDKWORK_ACCESS_TOKEN,
        environment,
      }),
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
