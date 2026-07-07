/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APPSTORE_API_URL: string;
  readonly VITE_APPSTORE_ABUSE_REPORT_EMAIL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
