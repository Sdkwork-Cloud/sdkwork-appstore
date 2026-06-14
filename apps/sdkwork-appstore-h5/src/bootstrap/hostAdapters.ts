export interface HostAdapter {
  name: string;
  available: boolean;
}

export interface HapticAdapter {
  light(): Promise<void>;
  medium(): Promise<void>;
  heavy(): Promise<void>;
}

export interface StatusBarAdapter {
  setStyle(style: 'light' | 'dark'): Promise<void>;
  setBackgroundColor(color: string): Promise<void>;
}

const hapticAdapter: HapticAdapter = {
  light: async () => {
    if ('vibrate' in navigator) navigator.vibrate(10);
  },
  medium: async () => {
    if ('vibrate' in navigator) navigator.vibrate(20);
  },
  heavy: async () => {
    if ('vibrate' in navigator) navigator.vibrate(30);
  },
};

const statusBarAdapter: StatusBarAdapter = {
  setStyle: async () => {},
  setBackgroundColor: async () => {},
};

export function getHapticAdapter(): HapticAdapter {
  return hapticAdapter;
}

export function getStatusBarAdapter(): StatusBarAdapter {
  return statusBarAdapter;
}

export function getAvailableHostAdapters(): HostAdapter[] {
  return [
    { name: 'haptic', available: typeof navigator !== 'undefined' && 'vibrate' in navigator },
    { name: 'status-bar', available: false },
  ];
}
