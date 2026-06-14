export type RuntimeTarget = 'browser' | 'desktop' | 'tablet-ipados' | 'tablet-android' | 'test-runner';
export type DeploymentMode = 'web' | 'desktop' | 'tablet-ipados' | 'tablet-android' | 'local' | 'private' | 'test';

interface RuntimeConfig {
  target: RuntimeTarget;
  deploymentMode: DeploymentMode;
  isDesktop: boolean;
  isTablet: boolean;
  isMobile: boolean;
}

const defaultConfig: RuntimeConfig = {
  target: 'browser',
  deploymentMode: 'web',
  isDesktop: false,
  isTablet: false,
  isMobile: false,
};

let currentRuntime: RuntimeConfig = defaultConfig;

export function getRuntime(): RuntimeConfig {
  return currentRuntime;
}

export function setRuntime(config: Partial<RuntimeConfig>): void {
  currentRuntime = { ...currentRuntime, ...config };
}

export function detectRuntime(): RuntimeConfig {
  const isDesktop = typeof window !== 'undefined' && '__TAURI__' in window;
  const isTablet = typeof navigator !== 'undefined' && /iPad|Android(?!.*Mobile)/.test(navigator.userAgent);

  if (isDesktop) {
    setRuntime({ target: 'desktop', deploymentMode: 'desktop', isDesktop: true });
  } else if (isTablet) {
    setRuntime({ target: 'tablet-ipados', deploymentMode: 'tablet-ipados', isTablet: true });
  }

  return currentRuntime;
}
