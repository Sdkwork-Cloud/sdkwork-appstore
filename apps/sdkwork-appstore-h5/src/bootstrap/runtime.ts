export type RuntimeTarget = 'browser' | 'capacitor-ios' | 'capacitor-android' | 'test-runner';

interface RuntimeConfig {
  target: RuntimeTarget;
  isCapacitor: boolean;
  isNative: boolean;
}

const defaultConfig: RuntimeConfig = {
  target: 'browser',
  isCapacitor: false,
  isNative: false,
};

let currentRuntime: RuntimeConfig = defaultConfig;

export function getRuntime(): RuntimeConfig {
  return currentRuntime;
}

export function setRuntime(config: Partial<RuntimeConfig>): void {
  currentRuntime = { ...currentRuntime, ...config };
}

export function detectRuntime(): RuntimeConfig {
  const isCapacitor = typeof window !== 'undefined' && 'Capacitor' in window;
  if (isCapacitor) {
    const platform = (window as any).Capacitor?.getPlatform?.() || 'web';
    if (platform === 'ios') {
      setRuntime({ target: 'capacitor-ios', isCapacitor: true, isNative: true });
    } else if (platform === 'android') {
      setRuntime({ target: 'capacitor-android', isCapacitor: true, isNative: true });
    }
  }
  return currentRuntime;
}
