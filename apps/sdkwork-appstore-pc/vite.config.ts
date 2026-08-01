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
        '@sdkwork/appstore-pc-core': path.resolve(__dirname, './packages/sdkwork-appstore-pc-core/src/index.ts'),
        '@sdkwork/appstore-pc-commons': path.resolve(__dirname, './packages/sdkwork-appstore-pc-commons/src/index.ts'),
        '@sdkwork/appstore-pc-shell': path.resolve(__dirname, './packages/sdkwork-appstore-pc-shell/src/index.ts'),
        '@sdkwork/appstore-pc-discover': path.resolve(__dirname, './packages/sdkwork-appstore-pc-discover/src/index.ts'),
        '@sdkwork/appstore-pc-apps': path.resolve(__dirname, './packages/sdkwork-appstore-pc-apps/src/index.ts'),
        '@sdkwork/appstore-pc-games': path.resolve(__dirname, './packages/sdkwork-appstore-pc-games/src/index.ts'),
        '@sdkwork/appstore-pc-ai-hub': path.resolve(__dirname, './packages/sdkwork-appstore-pc-ai-hub/src/index.ts'),
        '@sdkwork/appstore-pc-charts': path.resolve(__dirname, './packages/sdkwork-appstore-pc-charts/src/index.ts'),
        '@sdkwork/appstore-pc-search': path.resolve(__dirname, './packages/sdkwork-appstore-pc-search/src/index.ts'),
        '@sdkwork/appstore-pc-updates': path.resolve(__dirname, './packages/sdkwork-appstore-pc-updates/src/index.ts'),
        '@sdkwork/appstore-pc-app-detail': path.resolve(__dirname, './packages/sdkwork-appstore-pc-app-detail/src/index.ts'),
        '@sdkwork/appstore-pc-console-core': path.resolve(__dirname, './packages/sdkwork-appstore-pc-console-core/src/index.ts'),
        '@sdkwork/appstore-pc-console-shell': path.resolve(__dirname, './packages/sdkwork-appstore-pc-console-shell/src/index.ts'),
        '@sdkwork/appstore-pc-console-settings': path.resolve(__dirname, './packages/sdkwork-appstore-pc-console-settings/src/index.ts'),
        '@sdkwork/appstore-pc-admin-core': path.resolve(__dirname, './packages/sdkwork-appstore-pc-admin-core/src/index.ts'),
        '@sdkwork/appstore-pc-admin-shell': path.resolve(__dirname, './packages/sdkwork-appstore-pc-admin-shell/src/index.ts'),
        '@sdkwork/appstore-pc-admin-monitor': path.resolve(__dirname, './packages/sdkwork-appstore-pc-admin-monitor/src/index.ts'),
        '@sdkwork/appstore-pc-desktop': path.resolve(__dirname, './packages/sdkwork-appstore-pc-desktop/src/index.ts'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
